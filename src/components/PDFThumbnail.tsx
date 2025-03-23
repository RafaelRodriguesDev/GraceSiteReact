import React, { useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFThumbnailProps {
  pdfUrl: string;
  scale?: number;
  className?: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ pdfUrl, className = '' }) => {
  const thumbnailPluginInstance = thumbnailPlugin();

  return (
    <div className={`pdf-thumbnail-container ${className}`} style={{ width: '100%', height: '300px' }}>
      <Worker workerUrl={`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`}>
        <Viewer
          fileUrl={pdfUrl}
          plugins={[thumbnailPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default PDFThumbnail;
