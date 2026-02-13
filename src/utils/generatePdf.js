import { jsPDF } from 'jspdf';

const PAPER_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
};

const PX_TO_MM = 25.4 / 96;

function applyTransformToCanvas(dataUrl, rotation, cropData) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let sw = img.width;
      let sh = img.height;

      // Crop first
      let cx = 0, cy = 0, cw = sw, ch = sh;
      if (cropData) {
        cx = cropData.x;
        cy = cropData.y;
        cw = cropData.width;
        ch = cropData.height;
      }

      // After crop, apply rotation
      const isRotated = rotation === 90 || rotation === 270;
      const finalW = isRotated ? ch : cw;
      const finalH = isRotated ? cw : ch;

      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d');

      ctx.translate(finalW / 2, finalH / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      if (isRotated) {
        ctx.drawImage(img, cx, cy, cw, ch, -ch / 2, -cw / 2, ch, cw);
      } else {
        ctx.drawImage(img, cx, cy, cw, ch, -cw / 2, -ch / 2, cw, ch);
      }

      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', 0.92),
        width: finalW,
        height: finalH,
      });
    };
    img.src = dataUrl;
  });
}

export async function generatePdf(photos, pageSize = 'match', filename = 'photos', onProgress) {
  if (photos.length === 0) return;

  let doc = null;

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (onProgress) onProgress(i, photos.length);

    const { dataUrl, width, height } = await applyTransformToCanvas(
      photo.editedDataUrl || photo.originalDataUrl,
      photo.rotation || 0,
      photo.crop || null
    );

    if (pageSize === 'match') {
      // Page matches photo dimensions
      const pageW = width * PX_TO_MM;
      const pageH = height * PX_TO_MM;

      if (i === 0) {
        doc = new jsPDF({
          orientation: pageW > pageH ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pageW, pageH],
        });
      } else {
        doc.addPage([pageW, pageH], pageW > pageH ? 'landscape' : 'portrait');
      }

      doc.addImage(dataUrl, 'JPEG', 0, 0, pageW, pageH);
    } else {
      // Standard paper size
      const paper = PAPER_SIZES[pageSize];
      const imgAspect = width / height;
      const margin = 5; // 5mm margin
      const availW = paper.width - margin * 2;
      const availH = paper.height - margin * 2;
      const pageAspect = availW / availH;

      let imgW, imgH;
      if (imgAspect > pageAspect) {
        imgW = availW;
        imgH = availW / imgAspect;
      } else {
        imgH = availH;
        imgW = availH * imgAspect;
      }

      const x = (paper.width - imgW) / 2;
      const y = (paper.height - imgH) / 2;

      if (i === 0) {
        doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: pageSize === 'a4' ? 'a4' : [paper.width, paper.height],
        });
      } else {
        doc.addPage(
          pageSize === 'a4' ? 'a4' : [paper.width, paper.height],
          'portrait'
        );
      }

      doc.addImage(dataUrl, 'JPEG', x, y, imgW, imgH);
    }
  }

  if (onProgress) onProgress(photos.length, photos.length);
  
  // Clean filename - remove invalid characters and add .pdf extension if needed
  const cleanFilename = filename.replace(/[<>:"/\\|?*]/g, '').trim() || 'photos';
  const finalFilename = cleanFilename.endsWith('.pdf') ? cleanFilename : `${cleanFilename}.pdf`;
  
  doc.save(finalFilename);
}
