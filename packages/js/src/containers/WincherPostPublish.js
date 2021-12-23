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
		} = select( "yoast-seo/editor" );

		return {
			trackedKeyphrases: getWincherTrackedKeyphrases(),
			hasTrackedKeyphrases: hasWincherTrackedKeyphrases(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherOpenModal,
			setWincherTrackAllKeyphrases,
		} = dispatch( "yoast-seo/editor" );

		return {
			trackAll: () => {
				setWincherTrackAllKeyphrases( true );
				setWincherOpenModal( "postpublish" );
			},
		};
	} ),
] )( WincherPostPublish );
