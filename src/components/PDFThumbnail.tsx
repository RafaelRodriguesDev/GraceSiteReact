import React from 'react';
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
  return (
    <div className={`pdf-thumbnail-container ${className}`}>
      <div style={{ height: '100%' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
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
