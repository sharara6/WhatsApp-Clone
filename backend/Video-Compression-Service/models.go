package main

// CompressRequest represents the request for video compression
type CompressRequest struct {
	InputPath  string `json:"input_path"`
	OutputPath string `json:"output_path"`
}

// CompressResponse represents the response from video compression
type CompressResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}
