import "@testing-library/jest-dom";
import { createElement } from "@wordpress/element";
import { setLocaleData } from "@wordpress/i18n";
import "jest-styled-components";
import "raf/polyfill";
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

global.jQuery = jest.fn();
