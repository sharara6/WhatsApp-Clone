package main

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// CompressHandler handles HTTP requests for video compression
func CompressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CompressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendErrorResponse(w, "Invalid request body", err)
		return
	}

	// Create output directory if it doesn't exist
	outputDir := filepath.Dir(req.OutputPath)
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		SendErrorResponse(w, "Failed to create output directory", err)
		return
	}

	// Compress the video
	if err := CompressVideo(req.InputPath, req.OutputPath); err != nil {
		SendErrorResponse(w, "Video compression failed", err)
		return
	}

	// Send success response
	resp := CompressResponse{
		Success: true,
		Message: "Video compressed successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// SendErrorResponse sends an error response
func SendErrorResponse(w http.ResponseWriter, message string, err error) {
	resp := CompressResponse{
		Success: false,
		Message: message,
		Error:   err.Error(),
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(resp)
}

// HealthCheckHandler handles health check requests
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check if ffmpeg is available
	_, err := exec.LookPath("ffmpeg")
	status := "healthy"
	if err != nil {
		status = "unhealthy: ffmpeg not found"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":    status,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
