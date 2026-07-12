// imageOptimizer.js - Client-side image resizer and compressor for Joy

/**
 * Resizes and compresses a base64 image using an HTML5 Canvas.
 * Limits maximum dimensions to 800px and compresses to JPEG 80% quality.
 * 
 * @param {string} base64Data - Input base64 image (with or without data prefix)
 * @param {number} maxWidth - Max width threshold (default: 800)
 * @param {number} maxHeight - Max height threshold (default: 800)
 * @returns {Promise<string>} - Promise resolving to compressed base64 JPEG string
 */
export function compressImage(base64Data, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    // 1. Check if the input is a valid image base64
    if (!base64Data || !base64Data.startsWith('data:image')) {
      return resolve(base64Data); // Fallback: return original if not image data
    }

    const img = new Image();
    img.src = base64Data;

    img.onload = () => {
      // 2. Compute proportional scaling ratios
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // 3. Create Offscreen Canvas and draw scaled image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(base64Data); // Fallback if canvas context fails
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 4. Export as compressed JPEG (0.8 quality)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate and log compression stats in console for debugging/auditing
      const originalSizeKB = Math.round((base64Data.length * 3) / 4 / 1024);
      const compressedSizeKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      const reductionPercent = Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100);

      console.log(
        `[Image Compression] Resized from ${img.width}x${img.height} to ${width}x${height}. ` +
        `Size: ${originalSizeKB}KB -> ${compressedSizeKB}KB (${reductionPercent}% smaller) 📉`
      );

      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      console.error("[Image Compression] Image load error:", err);
      reject(err);
    };
  });
}
