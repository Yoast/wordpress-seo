import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import Results from "../components/contentAnalysis/Results";

export default compose( [
	withSelect( select => {
		const {
			getActiveMarker,
			getIsPremium,
			getShortcodesForParsing,
		} = select( "yoast-seo/editor" );

		return {
			activeMarker: getActiveMarker(),
			isPremium: getIsPremium(),
			shortcodesForParsing: getShortcodesForParsing(),
		};
	} ),
	withDispatch( dispatch => {
		const {
			setActiveMarker,
			setMarkerPauseStatus,
		} = dispatch( "yoast-seo/editor" );

		return {
			setActiveMarker,
			setMarkerPauseStatus,
		};
	} ),
] )( Results );
