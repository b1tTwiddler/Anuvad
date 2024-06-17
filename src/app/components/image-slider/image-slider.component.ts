import { Component, OnInit, signal } from '@angular/core';

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
}
