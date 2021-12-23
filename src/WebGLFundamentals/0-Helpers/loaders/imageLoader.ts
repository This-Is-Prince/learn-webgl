type LoadFunType = (image: HTMLImageElement) => void;
type ErrorFunType = (event?: Event | string) => void;
class ImageLoader {
  private totalImages: number;
  private loadedImages: number;
  private loaded: boolean;

  constructor() {
    this.totalImages = 0;
    this.loadedImages = 0;
    this.loaded = false;
  }
  load(url: string, load?: LoadFunType, error?: ErrorFunType) {
    this.loaded = false;
    this.totalImages++;
    const image = new Image();
    image.src = url;

    image.onload = () => {
      this.loadedImages++;
      if (this.loadedImages === this.totalImages) {
        this.loaded = true;
      }
      image.onload = null;
      if (load !== undefined) {
        load(image);
      }
    };

    image.onerror = (event) => {
      this.totalImages--;
      if (this.loadedImages === this.totalImages) {
        this.loaded = true;
      }
      image.onerror = null;
      if (error !== undefined) {
        error(event);
      } else {
        throw new Error("image is not loaded");
      }
    };
  }
}

export default ImageLoader;
