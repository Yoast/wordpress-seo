
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
/* eslint-disable no-unused-vars */
import initEditorStore from "./site-editor/initializers/editor-store";
import BlockEditorData from "./site-editor/analysis/blockEditorData";


domReady( () => {
	const postId = select( "core/edit-site" ).getEditedPostContext().postId;
	window.yoast = window.yoast || {};

	// window.yoast.EditorData = BlockEditorData;
	// console.log( postId );

	// window.YoastSEO.store = initEditorStore();
} );
