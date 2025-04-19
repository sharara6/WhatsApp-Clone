package main

import (
	"fmt"
	"os"
	"os/exec"
	"strconv"
)

/*
0 = lossless (no compression)
18-23 = visually lossless to most viewers
23 = default, good balance
28 = medium-low quality
51 = worst quality possible
*/

func compressVideo(inputPath, outputPath string, quality int) error {
	if !fileExists(inputPath) {
		return fmt.Errorf("input file does not exist: %s", inputPath)
	}

	// Validate quality range (CRF in ffmpeg is 0-51)
	if quality < 0 || quality > 51 {
		return fmt.Errorf("invalid quality value: %d (must be between 0-51)", quality)
	}

	qualityStr := strconv.Itoa(quality)
	cmd := exec.Command("ffmpeg", "-i", inputPath, "-vcodec", "libx264", "-crf", qualityStr, outputPath)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to compress video: %w", err)
	}
	return nil
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return !os.IsNotExist(err)
}
