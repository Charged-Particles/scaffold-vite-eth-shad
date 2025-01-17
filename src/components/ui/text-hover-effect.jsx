'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const TextHoverEffect = ({
  text,
  duration,
  strokeWidth = '0.3',
  fontSize = 'text-2xl',
}) => {
  const svgRef = useRef(null);
  const [ cursor, setCursor ] = useState({ x: 0, y: 0 });
  const [ hovered, setHovered ] = useState(false);
  const [ maskPosition, setMaskPosition ] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = svgRect.width > 0 ? ((cursor.x - svgRect.left) / svgRect.width) * 100 : 50;
      const cyPercentage = svgRect.height > 0 ? ((cursor.y - svgRect.top) / svgRect.height) * 100 : 50;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [ cursor ]);

  return (
    (<svg
      ref={svgRef}
      width="100%"
      height="28"
      viewBox="0 0 200 24"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none">
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor={'var(--yellow-500)'} />
              <stop offset="25%" stopColor={'var(--red-500)'} />
              <stop offset="50%" stopColor={'var(--blue-500)'} />
              <stop offset="75%" stopColor={'var(--cyan-500)'} />
              <stop offset="100%" stopColor={'var(--violet-500)'} />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      <text
        x="40%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        className={`font-[helvetica] font-bold stroke-neutral-700 dark:stroke-neutral-50 fill-transparent ${fontSize}`}
        style={{ opacity: hovered ? 0.95 : 0.8 }}>
        {text}
      </text>
      <motion.text
        x="40%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        className={`font-[helvetica] font-bold fill-transparent stroke-neutral-50 dark:stroke-neutral-700 ${fontSize}`}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
        }}>
        {text}
      </motion.text>
      <text
        x="40%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth={strokeWidth}
        mask="url(#textMask)"
        className={`font-[helvetica] font-bold fill-transparent ${fontSize}`}>
        {text}
      </text>
    </svg>)
  );
};
