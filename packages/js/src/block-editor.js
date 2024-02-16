/* eslint-disable no-unused-vars */
import initBlockEditorIntegration from "./initializers/block-editor-integration";
import BlockEditorData from "./analysis/blockEditorData";
import blockEditorSync from "./helpers/fields/blockEditorSync";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initBlockEditorIntegration;
window.yoast.EditorData = BlockEditorData;

blockEditorSync();
/* eslint-enable no-unused-vars */
