from flask import Flask, jsonify, send_file
from aduio_recorder import record_audio

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/record', methods=['POST'])
def start_recording():
    try:
        file_path = record_audio()
        return jsonify({
            "success": True,
            "file_name": file_path
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/audio/<filename>', methods=['GET'])
def get_audio(filename):
    try:
        return send_file(filename, as_attachment=True)
    except Exception:
        return jsonify({"success": False, "message": "File not found"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5003)
