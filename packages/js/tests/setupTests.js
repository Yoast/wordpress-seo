import "@testing-library/jest-dom";
import { createElement } from "@wordpress/element";
import { setLocaleData } from "@wordpress/i18n";
import "jest-styled-components";
import "raf/polyfill";
// eslint-disable-next-line no-restricted-imports -- We need to import React to set up the global React object.
import React from "react";

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
