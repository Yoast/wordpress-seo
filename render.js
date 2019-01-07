import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import AppWrapper from "./app/AppWrapper";

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
