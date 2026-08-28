import React, { useState } from 'react';
import { QrCode, FileText, Download, ScanLine } from 'lucide-react';
import QrScanner from './components/QrScanner.jsx';
import QrGenerator from './components/QrGenerator.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'qr'
  const pdfFileName = 'BONA BROCHURE SCAN CODE.pdf';
  const pdfFileSize = '92 MB';

  const triggerDownload = () => {
    // Create an anchor tag programmatically and trigger the download
    const link = document.createElement('a');
    link.href = `/${encodeURIComponent(pdfFileName)}`;
    link.download = pdfFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="logo-wrapper">
          <QrCode size={40} />
        </div>
        <h1 className="app-title">Bona Portal</h1>
        <p className="app-subtitle font-sans">
          Scan the QR code to instantly download the official Bona brochure to your device.
        </p>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          <ScanLine size={18} />
          Scan QR Code
        </button>
        <button 
          className={`tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          <QrCode size={18} />
          Show QR Code
        </button>
      </nav>

      {/* Main Feature Glass Card */}
      <main className={`glass-card ${activeTab === 'scan' ? 'glow' : ''}`}>
        {activeTab === 'scan' ? (
          <QrScanner 
            pdfFileName={pdfFileName} 
            onScanSuccess={triggerDownload} 
          />
        ) : (
          <QrGenerator 
            pdfFileName={pdfFileName} 
          />
        )}
      </main>

      {/* Brochure Manual Download Card */}
      <section className="brochure-card">
        <div className="brochure-icon-wrapper">
          <FileText size={28} />
        </div>
        <div className="brochure-details">
          <h2 className="brochure-title">{pdfFileName.replace('.pdf', '')}</h2>
          <span className="brochure-meta">PDF Document • {pdfFileSize}</span>
        </div>
        <button className="btn btn-download-sm" onClick={triggerDownload}>
          <Download size={16} />
          Download
        </button>
      </section>
    </div>
  );
}
