import "@testing-library/jest-dom";
import { setLocaleData } from "@wordpress/i18n";

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

global.React = React;

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
