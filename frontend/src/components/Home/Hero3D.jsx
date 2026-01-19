import React from 'react';
import { motion } from 'framer-motion';

const Hero3D = () => {
    return (
        <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            zIndex: 0, 
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0B1C33 0%, #050D1A 50%, #1A2E4D 100%)'
        }}>
            {/* Animated golden circles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    border: '2px solid #D4AF37',
                    opacity: 0.3
                }}
            />
            
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: '40%',
                    right: '25%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: '3px solid #D4AF37',
                    opacity: 0.2
                }}
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        backgroundColor: '#D4AF37',
                        opacity: 0
                    }}
                />
            ))}
        </div>
    );
};

export default Hero3D;
