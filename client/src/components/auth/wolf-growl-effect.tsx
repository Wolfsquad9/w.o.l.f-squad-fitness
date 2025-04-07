import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type WolfGrowlEffectProps = {
  isPlaying: boolean;
};

export default function WolfGrowlEffect({ isPlaying }: WolfGrowlEffectProps) {
  const [audioCreated, setAudioCreated] = useState(false);

  useEffect(() => {
    if (isPlaying && !audioCreated) {
      // Create the audio elements
      const growlAudio = new Audio();
      
      // Short growl sound effect - using base64 data URL for a simple growl sound
      growlAudio.src = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD/////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCgAAAAAAAAAGwzTWlUQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANmAqQZUwQAApEhX/uPmJdPnEQASABPnCd/SG/M2ad/uZnZgBIAbABIAG9waG9uaX8ADI+fsQCV/Lf/L8t/y/p3/IXh25ulEAW/tS1CtFhZWXTk4p0JnQgpHGKKjz/4xjEBw3z/qx1jGAAU7X0T0GJpRbHPr9JwXj8RBkgIJOsEEHUCSgRFQIQIUMUCRQXNJlbElgXNM3NMyyJNGYMOHEiyZ4Y5RV4JBh3lzlyR0GFEh8OgwkOhwqNlhwKBg6JiRMw/+MYxAcNywK1tYw0AH8NHCQ0OTlDg8UOmaTLHlygcQFAQcQFx4uRFCYoYKKHwYQYO/8+jGmyUhkzJE4sTHC5ITFSgsYHBjAODHE/5zmqnYqGKFyA4VPnJJvIEpQ0SAYWNYlkhwz/4xjECQ1DCq2VgwQAZQPKgGJj7JiJkw0cPiY4TNGTBw0cHgQkKGiYcKDYOYODyQEECpo0MFio0WLmTIo2QNDR00cHDR8ibHjBUcHDhYULixQcDtUkYGBnvvv+9nPV1mZszK7h/+MYxBYK8AK4AYEQAPd3Lqz8uGTKNs0GomTRcYJlBAaSLCZcuICAsYJlS4uZLCYoICJIoFDJw2YFiJEudKDIgSIj5YXFS7THkxpIWIi5QWIDhgmPDgwsAqYEjRQzgqYFhMXf4v/jGMQjDLAC0PWAEABhX+/tT7/+X/////4/5f//h3/Lfy/bf/+q/rr5TM67b+sCr2qblk5lv5TfOMzGgKgiA0BEBAOIsBAMVZhDQtZKaWj5ZCwDgQCgchUMUVEmJEXt/+MYxDEL2ALk9YAQAMKcFqibDn/qkRpsXAaSN3pLqkDgchcJwmAcBQBAFg0AQLgsAkLw9CwOA0AoDAaB0M+A0CYBgEC0SAUCoYPD8ZbMmJD6mIrFJ0QFShCYi9SsUkjZNzGt/+MYxD8MmOroE8EQAKWJqIYWTUWVExaJQzXTVDJiYWL12WNTCtWb+a2T11CiwbEyZVytQIajNqK8xiVODV//+02oE2oaIZNNREJq0TX//2uhkhVMQU1FMy45OS41VVVVVVVVVVVV/+MYxEsMMAKw9cAQAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
      
      // Play the growl sound
      growlAudio.volume = 0.6;
      growlAudio.play().catch(err => console.error("Error playing audio:", err));
      
      setAudioCreated(true);
    }
  }, [isPlaying, audioCreated]);

  if (!isPlaying) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Audio visualization waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary"
            initial={{ 
              width: 50, 
              height: 50, 
              opacity: 0.7,
            }}
            animate={{ 
              width: [50, 300 + i * 50],
              height: [50, 300 + i * 50],
              opacity: [0.7, 0],
            }}
            transition={{ 
              repeat: isPlaying ? 2 : 0,
              duration: 2,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      {/* Screen shake effect */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          x: isPlaying ? [0, -5, 5, -5, 5, 0] : 0,
        }}
        transition={{ 
          repeat: isPlaying ? 3 : 0,
          duration: 0.5, 
          repeatType: "loop"
        }}
      />
    </div>
  );
}