package main

import (
	"fmt"
	"os"
	"os/exec"
	"strconv"
)

// CompressVideo compresses a video using ffmpeg
func CompressVideo(inputPath, outputPath string) error {
	if !FileExists(inputPath) {
		return fmt.Errorf("input file does not exist: %s", inputPath)
	}

	// Get CRF value from environment or use default
	crf := "28" // Default value
	if envCRF := os.Getenv("DEFAULT_CRF"); envCRF != "" {
		if _, err := strconv.Atoi(envCRF); err == nil {
			crf = envCRF
		}
	}

	cmd := exec.Command("ffmpeg", "-i", inputPath, "-vcodec", "libx264", "-crf", crf, outputPath)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to compress video: %w", err)
	}
	return nil
}

// FileExists checks if a file exists
func FileExists(filename string) bool {
	_, err := os.Stat(filename)
	return !os.IsNotExist(err)
}
