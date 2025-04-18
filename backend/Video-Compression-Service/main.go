package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

// loadEnv loads environment variables from .env file
// This is a simple implementation; in production, consider using a library like godotenv
func loadEnv() {
	// If PORT is not already set in the environment, use the default
	if os.Getenv("PORT") == "" {
		os.Setenv("PORT", "8080")
	}
}

// enableCORS adds CORS headers to support API Gateway integration
func enableCORS(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get allowed origins from environment or use default
		allowedOriginsEnv := os.Getenv("ALLOWED_ORIGINS")
		allowedOrigins := "*" // Default to all origins

		if allowedOriginsEnv != "" {
			// If the request origin matches any in our allowed list
			requestOrigin := r.Header.Get("Origin")
			if requestOrigin != "" && strings.Contains(allowedOriginsEnv, requestOrigin) {
				allowedOrigins = requestOrigin
			}
		}

		// Allow requests from the specified origins
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigins)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handler.ServeHTTP(w, r)
	})
}

func main() {
	// Load environment variables
	loadEnv()

	// Set up logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("Starting Video Compression Service...")

	// Check if ffmpeg is available
	_, err := exec.LookPath("ffmpeg")
	if err != nil {
		log.Fatalf("ffmpeg not found: %v", err)
	}
	log.Println("ffmpeg found, service is ready")

	// Create a ServeMux for routing
	mux := http.NewServeMux()

	// Register HTTP handlers
	mux.HandleFunc("/compress", CompressHandler)
	mux.HandleFunc("/health", HealthCheckHandler)

	// Add an API Gateway integration route that just forwards to /compress
	mux.HandleFunc("/v1/compress", CompressHandler)

	// Apply CORS middleware
	corsHandler := enableCORS(mux)

	// Start the server
	port := os.Getenv("PORT")

	serverAddr := fmt.Sprintf(":%s", port)
	log.Printf("Server listening on %s", serverAddr)
	if err := http.ListenAndServe(serverAddr, corsHandler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
