// External dependencies.
import { combineReducers } from "redux";

// Internal dependencies.
import configuration from "./configuration";
import paper from "./paper";
import results from "./results";
import worker from "./worker";

export default combineReducers( {
	configuration,
	paper,
	results,
	worker,
} );


/*
<h1>YoastSEO.js development tool</h1>

<h2>Worker status</h2>

Updating
Analyzing
Idling

<h3>How long did the last analysis take?</h3>

30ms

<ul>
<li>Debugging information</li>
<li>Worker communication</li>
<li>Information about when it is refreshing</li>
<li>Buttons for standard texts in different languages</li>
<li>Language switcher</li>

<li>Input fields for everything</li>
<li>Total scores</li>

<li>Relevant words</li>
<li>All research data</li>

<li>Performance information</li>
</ul>
*/
