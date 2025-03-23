import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { RenderPage } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFThumbnailProps {
  pdfUrl: string;
  scale?: number;
  className?: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ pdfUrl, className = '' }) => {
  const [workerUrl, setWorkerUrl] = useState('');
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const version = pdfjsLib.version;
    setWorkerUrl(`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`);

    const handleResize = () => {
      setScale(window.innerWidth < 768 ? 0.35 : 0.7);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!workerUrl) {
    return null;
  }

  return (
    <div className={`pdf-thumbnail-container ${className}`}>
      <div style={{ height: '100%' }}>
        <Worker workerUrl={workerUrl}>
          <div>
            <Viewer
              fileUrl={pdfUrl}
              defaultScale={scale}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default PDFThumbnail;
