export default class SplitText {
	constructor(selector, space) {
		const element = document.querySelector(selector);

		element.style.display = "flex";
		element.style.flexWrap = "wrap";

		this.paragraph = {
			el: element,
			text: element.innerText,
			right: element.getBoundingClientRect().right,
			left: element.getBoundingClientRect().left,
		};
		this.spans = [];
		this.lines = [];

		this.splitWords(space);
		this.wrapInSpans();
		this.createLines();
		this.injectInHtml(selector);
	}

	splitWords(space) {
		this.words = this.paragraph.el.textContent.trim().split(/\s+/);

		this.words.forEach(word => {
			const span = document.createElement("span");
			span.style.paddingRight = space;
  		span.textContent = word;
			this.spans = [
				...this.spans,
				{
					el: span,
				}
			]
			this.paragraph.el.appendChild(span);
		})
	}

	wrapInSpans() {
		this.spans = this.spans.map(obj => {
			return {
				...obj,
				top: obj.el.getBoundingClientRect().top
			};
		});
	}

	createLines() {
		let newLine = "";
		let currentLineId = 0;

		for(let i = 0; i < this.spans.length; i++) {
			let currentId = i;
			let prevId = i === 0 ? i : i - 1;

			if(this.spans[prevId].top < this.spans[currentId].top) {
				this.lines = [...this.lines, newLine];
				newLine = this.spans[currentId].el.textContent + "";
				this.lines[currentLineId] = this.lines[currentLineId].trim()
				currentLineId += 1;
			} else {
				newLine += " " + this.spans[i].el.textContent;
			}
		}

		this.lines = [...this.lines, newLine];
		this.lines[currentLineId] = this.lines[currentLineId].trim()
	}

	injectInHtml(selector) {
		const newHtmlElement = document.querySelector(selector)
		newHtmlElement.innerHTML = "";

		this.lines.forEach(line => {
			const span = document.createElement("span");
			span.style.display = "block";
			span.textContent = line;
			
			const div = document.createElement("div");
			div.style.overflow = "hidden";
			div.append(span);

			newHtmlElement.append(div)
		})
	}
}