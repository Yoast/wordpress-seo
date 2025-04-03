import initClassicEditorIntegration from "./initializers/classic-editor-integration";
import ClassicEditorData from "./analysis/classicEditorData";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initClassicEditorIntegration;
window.yoast.EditorData = ClassicEditorData;
