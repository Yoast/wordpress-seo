/* eslint-disable no-unused-vars */
import initBlockEditorIntegration from "./initializers/block-editor-integration";
import BlockEditorData from "./analysis/blockEditorData";
import { blockEditorSync, hasHiddenFields } from "./helpers/fields";
import domReady from "@wordpress/dom-ready";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initBlockEditorIntegration;
window.yoast.EditorData = BlockEditorData;

domReady( () => {
	if ( ! hasHiddenFields() ) {
		blockEditorSync();
	}
} );

