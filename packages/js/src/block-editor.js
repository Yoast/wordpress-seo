/* eslint-disable no-unused-vars */
import initBlockEditorIntegration from "./initializers/block-editor-integration";
import BlockEditorData from "./analysis/blockEditorData";
import { blockEditorSync, hasHiddenFields } from "./helpers/fields";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initBlockEditorIntegration;
window.yoast.EditorData = BlockEditorData;

// console.log( hasHiddenFields() );
// if ( hasHiddenFields() ) {
blockEditorSync();
// }
/* eslint-enable no-unused-vars */
