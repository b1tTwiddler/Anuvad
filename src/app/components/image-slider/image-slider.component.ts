import { Component, OnInit, signal } from '@angular/core';
import { translate } from '../../../utils/ocr';

@Component({
  selector: 'av-image-slider',
  standalone: true,
  imports: [],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css',
})
export class ImageSliderComponent implements OnInit {
  images: string[] = [];
  currentImageIndex = signal(0);

  ngOnInit(): void {
    // Initialize the image list with paths (replace with actual logic)
    for (let i = 1; i <= 71; i++) {
      this.images.push(`images/sampleImages${i}.jpg`);
    }
  }
  ngAfterViewInit() {
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach((canvas) =>
      this.renderImage(canvas.id.split('-')[1], canvas)
    );
  }

  nextImage() {
    this.currentImageIndex.update(
      (value) => (this.images.length + value + 1) % this.images.length
    );
  }
  prevImage() {
    this.currentImageIndex.update(
      (value) => (this.images.length + value - 1) % this.images.length
    );
  }
  renderImage(imageUrl: string, canvasElement: HTMLCanvasElement) {
    const ctx = canvasElement.getContext('2d'); // Get 2D rendering context

    // Create a new image object
    const image = new Image();

    // Handle image loading and potential errors
    image.onload = function () {
      const imageWidth = image.width;
      const imageHeight = image.height;

      // Set canvas dimensions based on image size (optional)
      canvasElement.width = imageWidth;
      canvasElement.height = imageHeight;
      // console.log(imageWidth, imageHeight);

      // Draw the image onto the canvas
      ctx?.drawImage(image, 0, 0);
    };

    // Handle potential loading errors (optional)
    image.onerror = function () {
      console.error('Error loading image:', imageUrl);
      // You can display an error message or handle the error gracefully
    };

    // Set the image source to trigger loading
    image.src = imageUrl;
  }

  async handleTranslate() {
    let currentCanvasElement = document.getElementById(
      `image-${this.images[this.currentImageIndex()]}`
    ) as HTMLCanvasElement;
    // this.drawTextFit(currentCanvasElement, 20, 80, 200, 150, 'Ei bro Whats up');

    // let currentImageElement = document.getElementById(
    //   `image-${this.images[this.currentImageIndex()]}`
    // ) as HTMLImageElement;
    let imgBlob = await this.getImageBlob(
      this.images[this.currentImageIndex()]
    );
    let data = await translate(imgBlob as Blob);

    const ctx = currentCanvasElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    ctx.strokeStyle = 'red'; // Set stroke color for bounding boxes
    ctx.lineWidth = 2;
    // for blocks
    // for (const block of data.blocks || []) {
    //   // const { x0, y0, x1, y1 } = block.baseline;
    //   const { x0, y0, x1, y1 } = block.bbox;
    //   ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    // }

    //for lines
    for (const block of data.lines || []) {
      // if (block.confidence < 40) {
      //   continue;
      // }
      // const { x0, y0, x1, y1 } = block.baseline;
      const { x0, y0, x1, y1 } = block.bbox;
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    }

    // for paragraphs
    // for (const block of data.paragraphs || []) {
    //   // const { x0, y0, x1, y1 } = block.baseline;
    //   const { x0, y0, x1, y1 } = block.bbox;
    //   ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    // }

    //for symbols
    // for (const block of data.symbols || []) {
    //   // const { x0, y0, x1, y1 } = block.baseline;
    //   const { x0, y0, x1, y1 } = block.bbox;
    //   ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    // }

    // for words
    // for (const block of data.words || []) {
    //   // const { x0, y0, x1, y1 } = block.baseline;
    //   const { x0, y0, x1, y1 } = block.bbox;
    //   if (block.confidence < 50) {
    //     continue;
    //   }
    //   ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    // }
  }

  drawBoundingBoxes(canvasElement: HTMLCanvasElement) {
    const ctx = canvasElement.getContext('2d');
  }

  getImageBlob = async (imageUrl: string): Promise<Blob | undefined> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Error fetching image: ${response.statusText}`);
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching image:', error);
      return undefined;
    }
  };

  drawTextFit(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    textColor: string = 'red',
    fillColor: string = 'white',
    lineHeight: string = '20px',
    fontSize: string = '18px'
  ) {
    const svgCode = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="${width}" height="${height}">
            <style>
            p {
                margin:0;
                padding: 20px;
                overflow-wrap: break-word;
                font-weight: normal;
                font-family: serif;
                font-size: ${fontSize};
                line-height: ${lineHeight};
                color: ${textColor};
                background-color: ${fillColor};
                border-width: 1px;
                border-style: solid;
                border-color: black;
            }
            </style>
            <div xmlns="http://www.w3.org/1999/xhtml">
                <p>${text}</p>
            </div>
        </foreignObject>
    </svg>`;
    // Remove newlines and replace double quotes with single quotes
    const svgCodeEncoded = svgCode.replace(/\n/g, '').replace(/"/g, "'");

    // Dynamically create an image element
    const img = document.createElement('img');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    img.onload = () => {
      // Draw the image to the canvas
      ctx.drawImage(img, x, y);
    };
    img.src = `data:image/svg+xml,${svgCodeEncoded}`;
  }
}
