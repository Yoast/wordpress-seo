import domReady from "@wordpress/dom-ready";
import initPostEdit from "./initializers/post-edit";

domReady( () => {
	initPostEdit();
} );
