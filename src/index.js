/**
 * Manage element visibility.
 * You can use method "add" and "destroy" to register and unregister element from intersection observer instance.
 *
 * @author MiceliF
 */
class VisInViewport {
	constructor(opt = {}) {
		this.elements = []
		this.opt = opt
	}

	async init() {
		return this.loadPolyfill.then(() => {
			this.observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					let data = {}
					let elObj = entry.target
					let elOpt = this._getElementOption(elObj)
					let percentage = this._roundPercentage(entry.intersectionRatio * 100)

					data.movingAction = elObj.inViewPercentage > percentage ? 'hiding' : 'showing'
					data.percentage = percentage
					data.boundingClientRect = entry.boundingClientRect

					elObj.inViewPercentage = percentage

					if (percentage == 100 && !elObj.isFullInView) {
						if (!elObj.isInView) {
							this._callCb(elOpt.onEnter, elObj, data)
							elObj.isInView = true
						}

						this._callCb(elOpt.onFullEnter, elObj, data)
						elObj.isFullInView = true
					} else if (percentage > 0) {
						this._callCb(elOpt.isMoving, elObj, data)

						if (!elObj.isInView) {
							this._callCb(elOpt.onEnter, elObj, data)
							elObj.isInView = true
						}

						elObj.isFullInView = false
					} else {
						this._callCb(elOpt.onExit, elObj, data)
						elObj.isInView = false
						elObj.isFullInView = false
					}
				})
			}, {
				threshold: this.opt.threshold || this._getThreshold(),
			})
		})
	}

	async loadPolyfill() {
		if (!('IntersectionObserver' in window)) {
			return await import(
				/* webpackChunkName: "intersection-observer.polyfill" */
				'intersection-observer'
			)
		}

		return Promise.resolve()
	}

	/**
	 * Add element to observer
	 * @param {HtmlElement|String} el
	 * @param {Object} opt
	 * @param {Function} opt.onEnter
	 * @param {Function} opt.onFullEnter
	 * @param {Function} opt.onExit
	 * @param {Function} opt.isMoving
	 */
	add(el, opt = {}) {
		el = typeof el == 'string' ? document.querySelector(el) : el

		if (this.observer && el) {
			this.observer.observe(el)
			this.elements.push({
				el: el,
				opt: opt,
			})
		}
	}

	/**
	 * Remove element to observer
	 * @param {HtmlElement|String} el
	 */
	destroy(el) {
		el = typeof el == 'string' ? document.querySelector(el) : el

		this.observer.unobserve(el)
		this.elements = this.elements.filter(item => item.el != el)
		el.isInView = false
		el.isFullInView = false
	}

	_getElementOption(elObj) {
		return this.elements.find(item => item.el == elObj).opt
	}

	_roundPercentage(percentage) {
		if (percentage > 100) {
			percentage = 100
		} else if (percentage < 0) {
			percentage = 0
		} else {
			percentage = parseFloat(percentage.toFixed(0))
		}
		return percentage
	}

	_getThreshold() {
		return new Array(101).fill(0).map((zero, index) => {
			return index * 0.01
		})
	}

	_callCb(fn, el, data) {
		if (typeof fn == 'function') {
			fn(el, data)
		}
	}
}
