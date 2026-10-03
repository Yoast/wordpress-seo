/**
 * Creates a mocked image class that always loads successfully.
 *
 * @param {string} width The width of the mocked image.
 * @param {string} height The height of the mocked image.
 *
 * @returns {Object} Mocked image class that always loads successfully.
 */
export function createSuccessfulImage( width, height ) {
	/* eslint-disable jsdoc/require-jsdoc */
	class MockedImage {
		get src() {
			return this._src;
		}

		set src( src ) {
			this.width = width;
			this.height = height;
			this._src = src;

			if ( this.onload ) {
				this.onload();
			}
		}
	}
	/* eslint-enable */

	return MockedImage;
}

/**
 * Creates a mocked image class that always fails to load.
 *
 * @param {string} width The width of the mocked image.
 * @param {string} height The height of the mocked image.
 *
 * @returns {Object} Mocked image class that always fails to load.
 */
export function createFailingImage() {
	/* eslint-disable jsdoc/require-jsdoc */
	class MockedImage {
		get src() {
			return this._src;
		}

		set src( src ) {
			this._src = src;

			if ( this.onerror ) {
				this.onerror();
			}
		}
	}
	/* eslint-enable */

	return MockedImage;
}
