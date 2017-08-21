import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import TopLevelComponents from "./app/TopLevelComponents";

function render( RootElement ) {
	ReactDOM.render(
		<TopLevelComponents>
			<RootElement/>
		</TopLevelComponents>,
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
