FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    portaudio19-dev \
    python3-pyaudio \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional dependencies for audio recording
RUN pip install --no-cache-dir sounddevice scipy requests

# Copy application code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p uploads && \
    chmod -R 755 /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=5003

# Expose the port
EXPOSE 5003

# Run the application
CMD ["python", "serve.py"] 