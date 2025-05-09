import React, { useState, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const AudioMessageBubble = ({ audioUrl, isOwnMessage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className={`flex items-center space-x-2 p-2 rounded-lg max-w-xs ${
        isOwnMessage
          ? 'bg-blue-500 text-white ml-auto'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <button
        onClick={togglePlayback}
        className={`p-2 rounded-full ${
          isOwnMessage
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-200 hover:bg-gray-300'
        } transition-colors`}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <span className="text-sm">
        {audioRef.current ? `${Math.round(audioRef.current.duration)}s` : ''}
      </span>
    </div>
  );
};

export default AudioMessageBubble; 