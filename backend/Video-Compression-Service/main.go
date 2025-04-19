package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

const (
	uploadDir      = "./uploads"
	compressedDir  = "./compressed"
	defaultQuality = 23
)

type CompressResponse struct {
	Success       bool   `json:"success"`
	Message       string `json:"message"`
	CompressedURL string `json:"compressedUrl,omitempty"`
}

func main() {
	// Create required directories
	os.MkdirAll(uploadDir, 0755)
	os.MkdirAll(compressedDir, 0755)

	http.HandleFunc("/compress", handleCompression)
	http.HandleFunc("/health", handleHealth)

	// Serve compressed files
	http.Handle("/files/", http.StripPrefix("/files/", http.FileServer(http.Dir(compressedDir))))

	port := 8080
	log.Printf("Video Compression Service starting on port %d...\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}

func handleCompression(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form (max 32MB files)
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		sendErrorResponse(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Get the file from the request
	file, handler, err := r.FormFile("video")
	if err != nil {
		sendErrorResponse(w, "No video file provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file type (basic check)
	if !isVideoFile(handler.Filename) {
		sendErrorResponse(w, "File is not a recognized video format", http.StatusBadRequest)
		return
	}

	// Generate unique filename
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s", timestamp, handler.Filename)
	inputPath := filepath.Join(uploadDir, filename)

	// Get desired quality
	qualityStr := r.FormValue("quality")
	quality := defaultQuality // Default quality

	if qualityStr != "" {
		q, err := strconv.Atoi(qualityStr)
		if err == nil && q >= 0 && q <= 51 {
			quality = q
		}
	}

	// Save uploaded file
	outFile, err := os.Create(inputPath)
	if err != nil {
		sendErrorResponse(w, "Failed to save uploaded file", http.StatusInternalServerError)
		return
	}

	_, err = io.Copy(outFile, file)
	outFile.Close()
	if err != nil {
		sendErrorResponse(w, "Failed to save uploaded file", http.StatusInternalServerError)
		return
	}

	// Create output path for compressed file
	outputFilename := fmt.Sprintf("compressed_%d_%s", timestamp, handler.Filename)
	outputPath := filepath.Join(compressedDir, outputFilename)

	// Compress the video
	err = compressVideo(inputPath, outputPath, quality)
	if err != nil {
		// Clean up input file on error
		os.Remove(inputPath)
		sendErrorResponse(w, fmt.Sprintf("Compression failed: %v", err), http.StatusInternalServerError)
		return
	}

	// Remove the original uploaded file to save space
	os.Remove(inputPath)

	// Generate URL for the compressed file
	compressedURL := fmt.Sprintf("/files/%s", outputFilename)

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := CompressResponse{
		Success:       true,
		Message:       "Video compressed successfully",
		CompressedURL: compressedURL,
	}
	json.NewEncoder(w).Encode(response)
}

func sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	response := CompressResponse{
		Success: false,
		Message: message,
	}
	json.NewEncoder(w).Encode(response)
}

func isVideoFile(filename string) bool {
	ext := filepath.Ext(filename)
	videoExts := map[string]bool{
		".mp4":  true,
		".avi":  true,
		".mov":  true,
		".wmv":  true,
		".mkv":  true,
		".webm": true,
		".flv":  true,
	}
	return videoExts[ext]
}
