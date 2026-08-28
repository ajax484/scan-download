import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';

export default function QrGenerator({ pdfFileName, downloadLink }) {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Use the external download link directly
    setDownloadUrl(downloadLink);
  }, [downloadLink]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadQrCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40; // Add padding
      canvas.height = img.height + 40;
      ctx.fillStyle = "white"; // Add white background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20); // Draw image with padding
      const pngFile = canvas.toDataURL("image/png");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.download = "Bona-QR-Code.png";
      downloadAnchor.href = `${pngFile}`;
      downloadAnchor.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="generator-section">
      <p className="app-subtitle">
        Scan this QR code with your mobile phone's camera to download the PDF brochure.
      </p>

      {downloadUrl && (
        <div className="qr-code-wrapper" style={{ position: 'relative' }}>
          <QRCodeSVG
            id="qr-code-svg"
            value={downloadUrl}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#0f172a"
            level="H"
            includeMargin={true}
          />
        </div>
      )}

      <button className="btn btn-secondary" onClick={downloadQrCode} style={{ width: 'fit-content', margin: '0 auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
        <Download size={16} />
        Download QR Code
      </button>

      <div className="qr-info-box">
        {downloadUrl}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
        <button className="btn btn-secondary" onClick={copyToClipboard} style={{ flex: 1 }}>
          {copied ? (
            <>
              <Check size={18} className="text-success" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} />
              Copy Link
            </>
          )}
        </button>
        
        <a 
          href={downloadUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary" 
          style={{ flex: 1, textDecoration: 'none' }}
        >
          <ExternalLink size={18} />
          Open Link
        </a>
      </div>
    </div>
  );
}
