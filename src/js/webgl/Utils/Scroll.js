import LocomotiveScroll from 'locomotive-scroll';

export default class Scroll {
	constructor(webgl) {
		this.webgl = webgl;

		this.mainContainer = document.querySelector('main');
		this.gallery = document.querySelector('.container-grid')
		this.galleryCopy = document.querySelector('.container-grid__copy')

		this.instance = new LocomotiveScroll({
			el: document.querySelector('[data-scroll-container]'),
    	smooth: true,
			getDirection: true,
			getSpeed: true,
		});

		this.scrollDirection = null;

		this.getScrollDirection();
	}

	getScrollDirection() {
		this.instance.on('scroll', args => {
			this.scrollDirection = args.direction;
			this.scrollSpeed = this.instance.scroll.instance.speed

			for (const [key, value] of Object.entries(args.currentElements)) {
				if(this.scrollDirection === 'down') {
					if(value.progress > 0.995) {
						this.mainContainer.append(value.el)
						this.instance.update()
					}
				} else {
					// console.log('view')
				}
			}
		})
	}
}