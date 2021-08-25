/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherPostPublish from "../components/WincherPostPublish";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherTrackedKeyphrases,
			hasWincherTrackedKeyphrases,
			getWincherTrackableKeyphrases,
		} = select( "yoast-seo/editor" );

		return {
			trackedKeyphrases: getWincherTrackedKeyphrases(),
			hasTrackedKeyphrases: hasWincherTrackedKeyphrases(),
			keyphrases: getWincherTrackableKeyphrases(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherOpenModal,
			trackAllKeyphrases,
		} = dispatch( "yoast-seo/editor" );

		return {
			trackAll: ( keyphrases ) => {
				trackAllKeyphrases( keyphrases );
				setWincherOpenModal( "sidebar" );
			},
		};
	} ),
] )( WincherPostPublish );
