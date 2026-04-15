import { compose } from "@wordpress/compose";
import { withDispatch } from "@wordpress/data";
import { FeatureModal } from "../components/feature-modal";
import { CONTENT_PLANNER_STORE } from "../constants";

export default compose( [
	withDispatch( ( dispatch ) => {
		const { resetBlocks } = dispatch( "core/block-editor" );
		const { getContentOutline } = dispatch( CONTENT_PLANNER_STORE );

		return {
			resetBlocks,
			getContentOutline,
		};
	} ),
] )( FeatureModal );
