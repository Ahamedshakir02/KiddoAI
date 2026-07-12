import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Send, Palette, Square } from 'lucide-react';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Yellow', hex: '#f59e0b' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Black', hex: '#1e293b' }
];

export default function DrawingBoard({ activeBuddy, onSendDrawing }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1e293b');
  const [lineWidth, setLineWidth] = useState(6);

  // Initialize and handle canvas size adjustments on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Re-configure context styles after resize
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      contextRef.current = context;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Update stroke color when state changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  // Update line width when state changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support both mouse and touch input
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSend = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert to JPEG base64 data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onSendDrawing(dataUrl);
  };

  return (
    <div className="canvas-panel">
      <div className="canvas-toolbar">
        <div className="canvas-tools">
          <Palette size={20} className="text-slate-500 mr-2" />
          {COLORS.map((col) => (
            <div
              key={col.hex}
              className={`color-dot ${color === col.hex ? 'active' : ''}`}
              style={{ backgroundColor: col.hex }}
              onClick={() => setColor(col.hex)}
              title={col.name}
            />
          ))}
        </div>

        <div className="canvas-tools">
          <label className="text-xs font-semibold mr-2 kid-font">Pen Size:</label>
          <input
            type="range"
            min="2"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            style={{ width: '80px', accentColor: 'var(--buddy-color-primary)' }}
          />
        </div>

        <div className="canvas-tools" style={{ gap: '8px' }}>
          <button
            className="btn-header"
            onClick={clearCanvas}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
          
          <button
            className="btn-header btn-send"
            onClick={handleSend}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            <Send size={16} />
            <span>Ask Buddy</span>
          </button>
        </div>
      </div>

      <div className="canvas-container-outer" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
