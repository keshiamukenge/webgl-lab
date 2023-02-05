export default class Sizes {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.viewportOffset = this.height / 2;
    this.aspect = this.width / this.height;

		this.onResizeWindow();
  }

	onResizeWindow() {
		window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.aspect = this.width / this.height;
    });
	}
}