import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from datetime import datetime

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

client = MongoClient('mongodb://mongo:27017/')
db = client.audio_service
messages = db.messages

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/health', methods=['GET'])
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({'status': 'ok'}), 200
    except:
        return jsonify({'status': 'error'}), 500

@app.route('/upload', methods=['POST'])
def upload_audio():
    file = request.files.get('file')
    sender = request.form.get('sender')
    recipient = request.form.get('recipient')

    if not all([file, sender, recipient]):
        return jsonify({'error': 'Missing required fields'}), 400

    filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    message = {
        'sender': sender,
        'recipient': recipient,
        'filename': filename,
        'created_at': datetime.utcnow()
    }
    
    result = messages.insert_one(message)
    return jsonify({'id': str(result.inserted_id)}), 200

@app.route('/messages', methods=['GET'])
def get_messages():
    recipient = request.args.get('recipient')
    if not recipient:
        return jsonify({'error': 'Missing recipient'}), 400

    inbox = list(messages.find(
        {'recipient': recipient},
        {'_id': 1, 'sender': 1, 'filename': 1, 'created_at': 1}
    ).sort('created_at', -1))

    return jsonify([{
        'id': str(msg['_id']),
        'sender': msg['sender'],
        'url': f"/api/audio/{msg['filename']}",
        'created_at': msg['created_at'].isoformat()
    } for msg in inbox]), 200

@app.route('/<filename>', methods=['GET'])
def serve_audio(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
