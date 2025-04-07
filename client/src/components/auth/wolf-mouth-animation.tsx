import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type WolfMouthProps = {
  isAnimating: boolean;
  onAnimationComplete?: () => void;
}

export default function WolfMouthAnimation({ isAnimating, onAnimationComplete }: WolfMouthProps) {
  // Control states for sequential animation
  const [teethVisible, setTeethVisible] = useState(false);
  const [mouthOpening, setMouthOpening] = useState(false);
  const [mouthClosing, setMouthClosing] = useState(false);
  const [swallowEffect, setSwallowEffect] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      // Reset animation states
      setTeethVisible(false);
      setMouthOpening(false);
      setMouthClosing(false);
      setSwallowEffect(false);
      
      // Start animation sequence
      const showTeeth = setTimeout(() => setTeethVisible(true), 100);
      const startOpening = setTimeout(() => setMouthOpening(true), 400);
      const startClosing = setTimeout(() => {
        setMouthClosing(true);
        setMouthOpening(false);
      }, 1800);
      const startSwallow = setTimeout(() => {
        setSwallowEffect(true);
      }, 2400);
      const completeAnimation = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, 3000);
      
      return () => {
        clearTimeout(showTeeth);
        clearTimeout(startOpening);
        clearTimeout(startClosing);
        clearTimeout(startSwallow);
        clearTimeout(completeAnimation);
      };
    }
  }, [isAnimating, onAnimationComplete]);

  // Early return if not animating
  if (!isAnimating && !mouthClosing) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* SVG Wolf Mouth Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Background Effects */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black via-primary/30 to-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: teethVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Glowing Eyes */}
          <AnimatePresence>
            {teethVisible && (
              <motion.div 
                className="absolute"
                style={{ top: '30%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex space-x-40">
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-primary"
                    animate={{ 
                      boxShadow: [
                        '0 0 10px 4px rgba(255, 255, 255, 0.3)', 
                        '0 0 20px 8px rgba(255, 255, 255, 0.5)',
                        '0 0 10px 4px rgba(255, 255, 255, 0.3)'
                      ] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      repeatType: "reverse"
                    }}
                  />
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-primary"
                    animate={{ 
                      boxShadow: [
                        '0 0 10px 4px rgba(255, 255, 255, 0.3)', 
                        '0 0 20px 8px rgba(255, 255, 255, 0.5)',
                        '0 0 10px 4px rgba(255, 255, 255, 0.3)'
                      ] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      repeatType: "reverse" 
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upper Jaw with Teeth */}
          <motion.div 
            className="absolute w-full"
            initial={{ y: "-100vh" }}
            animate={{ 
              y: mouthOpening ? "0%" : mouthClosing ? "-25%" : "-100vh" 
            }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 200,
              duration: mouthClosing ? 0.5 : 0.8
            }}
          >
            <svg 
              viewBox="0 0 600 200" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              {/* Upper Jaw Background */}
              <path
                d="M0,0 L600,0 L600,100 C500,200 100,200 0,100 Z"
                fill="#111"
              />
              
              {/* Upper Teeth */}
              <path
                d="M100,100 L125,150 L150,100 L175,150 L200,100 L225,150 L250,100 L275,150 L300,100 L325,150 L350,100 L375,150 L400,100 L425,150 L450,100 L475,150 L500,100"
                fill="none"
                stroke="white"
                strokeWidth="8"
              />
              
              {/* Realistic Gums */}
              <path
                d="M50,90 C200,130 400,130 550,90"
                fill="none"
                stroke="#740c0c"
                strokeWidth="15"
                opacity="0.7"
              />
            </svg>
          </motion.div>

          {/* Lower Jaw with Teeth */}
          <motion.div 
            className="absolute w-full"
            initial={{ y: "100vh" }}
            animate={{ 
              y: mouthOpening ? "0%" : mouthClosing ? "25%" : "100vh" 
            }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 200,
              duration: mouthClosing ? 0.5 : 0.8
            }}
          >
            <svg 
              viewBox="0 0 600 200" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              {/* Lower Jaw Background */}
              <path
                d="M0,100 C100,0 500,0 600,100 L600,200 L0,200 Z"
                fill="#111"
              />
              
              {/* Lower Teeth */}
              <path
                d="M100,100 L125,50 L150,100 L175,50 L200,100 L225,50 L250,100 L275,50 L300,100 L325,50 L350,100 L375,50 L400,100 L425,50 L450,100 L475,50 L500,100"
                fill="none"
                stroke="white"
                strokeWidth="8"
              />
              
              {/* Realistic Gums */}
              <path
                d="M50,110 C200,70 400,70 550,110"
                fill="none"
                stroke="#740c0c"
                strokeWidth="15"
                opacity="0.7"
              />
            </svg>
          </motion.div>

          {/* Throat Effect (visible when mouth is closing) */}
          <AnimatePresence>
            {swallowEffect && (
              <motion.div 
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="w-full h-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 15, 30] }}
                  transition={{ duration: 1, times: [0, 0.7, 1] }}
                >
                  {/* Wolf Emblem - appears at the end */}
                  <svg 
                    width="50" 
                    height="50" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                  >
                    <path 
                      d="M12 2L14.5 5L17.5 3L16 7L20 8L16.5 10L18 14L14 12L12 16L10 12L6 14L7.5 10L4 8L8 7L6.5 3L9.5 5L12 2Z" 
                      fill="currentColor" 
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}