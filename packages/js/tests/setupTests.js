import "raf/polyfill";
import "jest-styled-components";
import React from "react";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import { setLocaleData } from "@wordpress/i18n";
import { createElement } from "@wordpress/element";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

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
