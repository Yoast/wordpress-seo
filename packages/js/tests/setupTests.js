import "@testing-library/jest-dom";
import { createElement } from "@wordpress/element";
import { setLocaleData } from "@wordpress/i18n";
import "jest-styled-components";
import "raf/polyfill";
// eslint-disable-next-line no-restricted-imports -- We need to import React to set up the global React object.
import React from "react";
import { TextEncoder, TextDecoder } from "util";

setLocaleData( {
	"": {
		domain: "wordpress-seo",
		lang: "en",
		/* eslint-disable */
		plural_forms: "nplurals=2; plural=(n != 1);",
		/* eslint-enable */
	},
}, "wordpress-seo" );


/* Setup react to be used like in WordPress. */
global.React = React;
global.wp = {
	element: {
		createElement,
	},
};

global.wpApiSettings = {
	nonce: "nonce",
	root: "http://example.com",
};

/* Mock the IntersectionObserver. */
global.IntersectionObserver = class {
	/**
	 * Constructor.
	 */
	constructor() {}

	/**
	 * Observe.
	 * @returns {void}
	 */
	observe() {}

	/**
	 * Unobserve.
	 * @returns {void}
	 */
	unobserve() {}

	/**
	 * Disconnect.
	 * @returns {void}
	 */
	disconnect() {}
};

global.jQuery = jest.fn();

global.HTMLCanvasElement.prototype.getContext = function( type ) {
	if ( type === "2d" ) {
		return {
			// Mock methods and properties used by Chart.js
			createLinearGradient: () => ( {
				addColorStop: jest.fn(),
			} ),
			fillRect: jest.fn(),
			clearRect: jest.fn(),
		};
	}
	return null;
};

// When using the GradientButton from the ai-frontend: Jose needs the TextEncoder and TextDecoder global objects to be available. These are available in browsers, but not in Jest.
// This is a workaround to make them available in Jest.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
