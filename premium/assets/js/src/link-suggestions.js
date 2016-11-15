/* global yoastLinkSuggestions */

// Required for browser compatibility.
import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { Suggestions } from "yoast-premium-components";


class App extends React.Component {

	/**
	 * Renders the App component.
	 *
	 * @returns {JSX.Element|null} The rendered app component.
	 */
	render() {
		return (
			<div>
				<Suggestions suggestions={yoastLinkSuggestions.suggestions} />
			</div>
		);
	}
}


jQuery( function() {
	ReactDOM.render( <App/>, document.getElementById( "yoast_metabox_link_suggestions_post" ) );
});
