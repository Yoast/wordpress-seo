/* global yoastLinkSuggestions */

// Required for browser compatibility.
import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { LinkSuggestions } from "yoast-premium-components";


class App extends React.Component {

	/**
	 * Renders the App component.
	 *
	 * @returns {JSX.Element|null} The rendered app component.
	 */
	render() {
		return (
			<div>
				<LinkSuggestions suggestions={yoastLinkSuggestions.suggestions} />
			</div>
		);
	}
}


jQuery( function() {
	ReactDOM.render( <App/>, document.getElementById( "yoast_metabox_link_suggestions_post" ) );
});
