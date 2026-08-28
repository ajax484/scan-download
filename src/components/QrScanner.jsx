import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function QrScanner({ pdfFileName, downloadLink, onScanSuccess }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMessage, setScannerMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [hasPermission, setHasPermission] = useState(null);

  const scannerRef = useRef(null); // Ref for Html5Qrcode instance
  const elementId = "scanner-video-preview";

  // Request cameras on component mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCameraId(devices[0].id);
          setHasPermission(true);
        } else {
          setScannerMessage({ type: 'error', text: 'No camera devices found.' });
          setHasPermission(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching cameras:', err);
        setHasPermission(false);
        setScannerMessage({ 
          type: 'error', 
          text: 'Camera access denied. Please grant camera permissions in your browser settings.' 
        });
      });

    // Cleanup function to ensure scanner is stopped when component unmounts
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!selectedCameraId) return;
    
    // Clear messages
    setScannerMessage(null);

    // Stop any existing scanner first
    await stopScanner();

    try {
      const html5QrCode = new Html5Qrcode(elementId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: (width, height) => {
          // Responsive qrbox size
          const size = Math.min(width, height) * 0.7;
          return { width: size, height: size };
        }
      };

      await html5QrCode.start(
        selectedCameraId,
        config,
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        () => {
          // Silent failure callback for scanning frames
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setScannerMessage({ type: 'error', text: 'Failed to start camera feed. It might be in use by another app.' });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      }
    }
  };

  const handleDecodedText = (text) => {
    console.log('Scanned QR text:', text);

    // Check if the scanned QR code contains the PDF file name, the downloadLink, or is a valid download URL
    const isValid = text.includes(pdfFileName) || text.includes(encodeURIComponent(pdfFileName)) || text.includes('BONA') || (downloadLink && text.includes(downloadLink));

    if (isValid) {
      // Stop scanning on success
      stopScanner();
      
      setScannerMessage({ 
        type: 'success', 
        text: 'QR code verified! Your brochure download is starting...' 
      });

      // Call parent callback to trigger the download
      onScanSuccess();
    } else {
      setScannerMessage({ 
        type: 'error', 
        text: `QR code detected but invalid: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}".` 
      });
    }
  };

  const handleCameraChange = (e) => {
    const newCameraId = e.target.value;
    setSelectedCameraId(newCameraId);
    if (isScanning) {
      // Restart scanner with new camera
      setTimeout(() => {
        startScanner();
      }, 100);
    }
  };

  return (
    <div className="scanner-section">
      <p className="app-subtitle">
        Grant camera permissions, select your webcam, and place the static QR code in front of the lens.
      </p>

      {/* Camera Selection controls */}
      {hasPermission && cameras.length > 0 && (
        <div className="scan-controls">
          <div className="select-container">
            <label htmlFor="camera-select" className="select-label">Select Input Device</label>
            <select
              id="camera-select"
              className="custom-select"
              value={selectedCameraId}
              onChange={handleCameraChange}
              disabled={isScanning}
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Scanner Viewport */}
      <div className={`scanner-viewport-wrapper ${isScanning ? 'active' : ''}`}>
        {/* Hidden/Active scanning video element */}
        <div id={elementId} style={{ width: '100%', height: '100%' }}></div>

        {/* Custom Overlay (Laser line and reticle) */}
        {isScanning && (
          <div className="scanner-overlay">
            <div className="scanner-reticle">
              <div className="scanner-laser"></div>
            </div>
          </div>
        )}

        {/* Video placeholder when not scanning */}
        {!isScanning && (
          <div className="camera-placeholder">
            <Camera className="camera-placeholder-icon" />
            <p style={{ fontSize: '0.9rem' }}>Camera preview is inactive</p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {scannerMessage && (
        <div className={`message-box ${scannerMessage.type}`}>
          {scannerMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{scannerMessage.text}</span>
        </div>
      )}

      {/* Action Buttons */}
      {isScanning ? (
        <button className="btn btn-secondary" onClick={stopScanner}>
          <CameraOff size={20} />
          Stop Scanner
        </button>
      ) : (
        <button 
          className="btn btn-primary" 
          onClick={startScanner}
          disabled={hasPermission === false}
        >
          <Camera size={20} />
          Start Scanning
        </button>
      )}
    </div>
  );
}
