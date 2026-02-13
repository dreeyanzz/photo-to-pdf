let nextId = 1;

export function createPhotoObject(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          id: `photo-${nextId++}`,
          name: file.name,
          originalDataUrl: e.target.result,
          editedDataUrl: null,
          rotation: 0,
          crop: null,
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    image.src = imageSrc;
  });
}

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function isValidImageFile(file) {
  return ACCEPTED_TYPES.includes(file.type);
}
