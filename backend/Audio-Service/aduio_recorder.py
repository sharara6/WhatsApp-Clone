import sounddevice as sd
from scipy.io.wavfile import write

import datetime

freq = 44100
max_duration = 10  

def record_audio():

    recording = sd.rec(int(max_duration * freq), 
                    samplerate=freq, channels=2)
    print("Recording started for " + str(max_duration) + " seconds")
    sd.wait()

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"recording_{timestamp}.wav"

    write(filename, freq, recording)
    print(f"Recording saved to {filename}")
    
    return filename