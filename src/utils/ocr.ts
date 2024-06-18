import Tesseract, { createWorker } from 'tesseract.js';

export async function translate(img: Blob): Promise<Tesseract.Page> {
  const worker = await createWorker('chi_sim');
  await worker.setParameters({
    preserve_interword_spaces: '1',
  });
  const resp = await worker.recognize(img);
  console.log(resp.data);
  await worker.terminate();
  return resp.data;
}
