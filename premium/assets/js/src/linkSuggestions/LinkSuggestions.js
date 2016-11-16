
import { LinkSuggestions } from "yoast-premium-components";
import React from "react";
import ReactDOM from "react-dom";

export default function( suggestions, targetElement ) {
	ReactDOM.render( <div className="yoast-link-suggestions"><LinkSuggestions suggestions={suggestions} /></div>, targetElement );
}


