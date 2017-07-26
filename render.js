import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppContainer } from "react-hot-loader";

function render( RootElement ) {
	ReactDOM.render(
		<AppContainer>
			<RootElement/>
		</AppContainer>,
		document.getElementById("container")
	);
}

render( App );

if ( module.hot ) {
	module.hot.accept( "./App", () => {
		const NextRoot = require( "./App" ).default;
		render( NextRoot );
	} );
}
