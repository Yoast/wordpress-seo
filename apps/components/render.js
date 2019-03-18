import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import AppWrapper from "./AppWrapper";

/**
 * Renders the given RootElement within an AppWrapper component.
 *
 * @param {ReactElement} RootElement The RootElement to be wrapped.
 *
 * @returns {void}
 */
function render( RootElement ) {
	ReactDOM.render(
		<AppWrapper>
			<RootElement />
		</AppWrapper>,
		document.getElementById( "container" )
	);
}

render( App );

if ( module.hot ) {
	module.hot.accept( "./App", () => {
		const NextRoot = require( "./App" ).default; // eslint-disable-line global-require
		render( NextRoot );
	} );
}
