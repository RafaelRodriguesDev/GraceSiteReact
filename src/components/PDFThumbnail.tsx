import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { RenderPage } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';

interface PDFThumbnailProps {
  pdfUrl: string;
  scale?: number;
  className?: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ pdfUrl, className = '' }) => {
  const [workerUrl, setWorkerUrl] = useState('https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js');

  useEffect(() => {
    const checkWorkerVersion = async () => {
      try {
        await fetch('https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js');
      } catch (error) {
        setWorkerUrl('https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js');
      }
    };

    checkWorkerVersion();
  }, []);

  return (
    <div className={`pdf-thumbnail-container ${className}`}>
      <div style={{ height: '100%' }}>
        <Worker workerUrl={workerUrl}>
          <div>
            <Viewer
              fileUrl={pdfUrl}
              defaultScale={0.7}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default PDFThumbnail;
