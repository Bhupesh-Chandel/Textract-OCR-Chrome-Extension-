import { createWorker } from 'tesseract.js';

let worker;

async function loadTesseractWorker() {
  if (!worker) {
    worker = await createWorker({
      logger: m => console.log(m), // optional logging
    });
    // In v6, createWorker() returns a ready-to-use worker instance
  }
}

async function extractTextFromVideo() {
  const video = document.querySelector('video');
  if (!video) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  await loadTesseractWorker();

  try {
    const { data: { text } } = await worker.recognize(canvas);
    console.log('OCR result:', text);
    await navigator.clipboard.writeText(text.trim());
    alert('Extracted text copied to clipboard!');
  } catch (error) {
    console.error('Error during OCR:', error);
  }
}

async function setupListeners(enabled) {
  const video = document.querySelector('video');
  if (!video) return;

  if (enabled) {
    video.addEventListener('pause', extractTextFromVideo);
  } else {
    video.removeEventListener('pause', extractTextFromVideo);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.enabled !== undefined) {
    setupListeners(message.enabled);
  }
});

