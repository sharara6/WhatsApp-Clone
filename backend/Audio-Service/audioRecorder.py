import argparse
import os
import time
import sounddevice as sd
from scipy.io.wavfile import write
import requests
import threading
import wave
import numpy as np

SERVER_URL = "http://localhost:5003"

def record_audio(out_path, samplerate=16000, duration=5, channels=1):
    """Record `duration` seconds of audio and save to WAV."""
    print(f"[REC] Recording {duration}s at {samplerate}Hz → {out_path}")
    rec = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=channels)
    sd.wait()
    data = (rec * 32767).astype('int16')
    write(out_path, samplerate, data)
    print("[REC] Saved.")

def upload_audio(file_path, sender, recipient):
    """POST the recorded file to the backend."""
    url = f"{SERVER_URL}/upload"
    with open(file_path, 'rb') as f:
        files = {'file': (os.path.basename(file_path), f, 'audio/wav')}
        data  = {'sender': sender, 'recipient': recipient}
        resp = requests.post(url, files=files, data=data)
    resp.raise_for_status()
    print(f"[UPLOAD] {file_path} → {recipient}: {resp.json()}")

def download_and_play(msg, out_dir="downloads"):
    """Download a message and play it via the default audio device."""
    os.makedirs(out_dir, exist_ok=True)
    # Extract filename from the URL
    filename = msg['url'].split('/')[-1]
    url = f"{SERVER_URL}/{filename}"
    local_path = os.path.join(out_dir, filename)
    if os.path.exists(local_path):
        return  # already downloaded
    print(f"[DL] From {msg['sender']}: downloading {filename}…")
    r = requests.get(url)
    r.raise_for_status()
    with open(local_path, 'wb') as f:
        f.write(r.content)
    # play it
    with wave.open(local_path, 'rb') as wf:
        sr = wf.getframerate()
        frames = wf.readframes(wf.getnframes())
        # Convert bytes to numpy array
        audio_data = np.frombuffer(frames, dtype=np.int16)
        # Reshape if stereo
        if wf.getnchannels() == 2:
            audio_data = audio_data.reshape(-1, 2)
        sd.play(audio_data, sr)
        sd.wait()
    print(f"[PLAY] Played {filename}")

def poll_inbox(recipient, interval=5):
    """Every `interval` seconds, fetch new messages and play them."""
    seen = set()
    while True:
        resp = requests.get(f"{SERVER_URL}/messages", params={'recipient': recipient})
        resp.raise_for_status()
        for m in resp.json():
            if m['id'] not in seen:
                seen.add(m['id'])
                download_and_play(m)
        time.sleep(interval)

if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Voice chat client")
    sub = p.add_subparsers(dest="cmd", required=True)

    # send command
    ps = sub.add_parser("send", help="Record and send a voice message")
    ps.add_argument("--sender",    required=True, help="Your user ID")
    ps.add_argument("--recipient", required=True, help="Friend's user ID")
    ps.add_argument("--duration",  type=int, default=5, help="Seconds to record")
    ps.add_argument("--out",       default="msg.wav", help="WAV filename")

    # receive command
    pr = sub.add_parser("recv", help="Poll inbox and play new messages")
    pr.add_argument("--recipient", required=True, help="Your user ID")
    pr.add_argument("--interval",  type=int, default=5, help="Seconds between polls")

    args = p.parse_args()

    if args.cmd == "send":
        record_audio(args.out, duration=args.duration)
        upload_audio(args.out, args.sender, args.recipient)

    elif args.cmd == "recv":
        print(f"[POLL] Starting to poll for {args.recipient} every {args.interval}s …")
        poll_inbox(args.recipient, interval=args.interval)
