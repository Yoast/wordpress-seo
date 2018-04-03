import { createElement, Component } from "@wordpress/element";

window.wp = {};

// Necessary for the pragma config
// Component is used by the Dashicon component
window.wp.element = { createElement, Component };
