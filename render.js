import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import App from "./App";
import TopLevelComponents from "./app/TopLevelComponents";

function render( RootElement ) {
	ReactDOM.render(
		<AppContainer>
			<TopLevelComponents>
				<RootElement/>
			</TopLevelComponents>
		</AppContainer>,
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
