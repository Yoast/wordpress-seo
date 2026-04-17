import { compose } from "@wordpress/compose";
import { withDispatch } from "@wordpress/data";
import { ContentPlannerEditorItem } from "../components/content-planner-editor-item";
import { CONTENT_PLANNER_STORE } from "../constants";

export default compose( [
	withDispatch( ( dispatch ) => {
		const { openModal, setFeatureModalStatus } = dispatch( CONTENT_PLANNER_STORE );
		return {
			openModal,
			setFeatureModalStatus,
		};
	} ),
] )( ContentPlannerEditorItem );
