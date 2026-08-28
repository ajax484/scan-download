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

  return (
    <div className="generator-section">
      <p className="app-subtitle">
        Scan this QR code with your mobile phone's camera (on the same Wi-Fi network) to download the PDF brochure.
      </p>

      {downloadUrl && (
        <div className="qr-code-wrapper">
          <QRCodeSVG
            value={downloadUrl}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#0f172a"
            level="H"
            includeMargin={true}
          />
        </div>
      )}

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
