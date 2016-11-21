import { LinkSuggestions } from "yoast-premium-components";
import React from "react";
import ReactDOM from "react-dom";

/**
 * Renders the react component.
 *
 * @param {array}   suggestions   Array with link suggestions.
 * @param {Element} targetElement The element to put the component in.
 *
 * @returns {void}
 */
export default function( suggestions, targetElement ) {
	ReactDOM.render( <div className="yoast-link-suggestions"><LinkSuggestions suggestions={suggestions} /></div>, targetElement );
}
