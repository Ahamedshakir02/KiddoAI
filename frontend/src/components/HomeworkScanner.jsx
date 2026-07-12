import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';

export default function HomeworkScanner({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to rear camera on phones

  // Start Camera helper
  const startCamera = async (mode = 'environment') => {
    stopCamera(); // Clean existing streams first
    setCameraError(null);

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera Access Error:", err);
      setCameraError("Could not access camera. Try uploading a photo instead!");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Toggle front/back cameras
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture current video frame
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !cameraActive) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.8);
    
    stopCamera();
    onCapture(base64Data);
  };

  // Handle local file uploads
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        onCapture(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  // Automatically start camera on mount, stop on unmount
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="camera-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', background: '#1e293b', color: 'white' }}>
        <button 
          className="modal-close" 
          onClick={() => {
            stopCamera();
            onClose();
          }}
          style={{ color: 'white' }}
        >
          <X size={24} />
        </button>

        <h2 className="kid-font" style={{ fontSize: '24px', marginBottom: '8px', color: '#38bdf8', textAlign: 'center' }}>
          📷 Homework Scanner
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px' }}>
          Hold your writing or homework page in front of the camera, or choose a file!
        </p>

        {cameraError ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', background: '#334155', borderRadius: '12px', border: '1px dashed #ef4444' }}>
            <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{cameraError}</p>
            <label className="btn-header" style={{ display: 'inline-flex', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none' }}>
              <Upload size={16} style={{ marginRight: '6px' }} />
              Choose Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        ) : (
          <div className="camera-preview-container">
            <video
              ref={videoRef}
              className="camera-preview-video"
              playsInline
              muted
            />
            <div className="camera-viewfinder" />
          </div>
        )}

        <div className="camera-controls">
          {cameraActive && (
            <>
              <button 
                className="btn-header" 
                onClick={toggleCameraFacing} 
                style={{ flex: 1, display: 'flex', justifyContent: 'center', background: '#334155', border: '1px solid #475569', color: 'white' }}
              >
                <RefreshCw size={18} style={{ marginRight: '6px' }} />
                <span>Switch Camera</span>
              </button>
              
              <button 
                className="btn-header btn-send" 
                onClick={captureFrame} 
                style={{ flex: 2, display: 'flex', justifyContent: 'center', background: '#ef4444', color: 'white', border: 'none', boxShadow: 'none' }}
              >
                <Camera size={18} style={{ marginRight: '6px' }} />
                <span>Snap Picture</span>
              </button>
            </>
          )}

          {!cameraActive && !cameraError && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Starting camera feed...</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <label className="btn-header" style={{ cursor: 'pointer', background: '#334155', border: '1px solid #475569', color: '#94a3b8' }}>
            <Upload size={16} style={{ marginRight: '6px' }} />
            <span>Upload from Gallery</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  );
}
