import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import WincherPostPublish from "../components/WincherPostPublish";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherIsTracking,
			getWincherTrackedKeyphrases,
		} = select( "yoast-seo/editor" );

		return {
			isTrackingArticle: getWincherIsTracking(),
			trackedKeyphrases: getWincherTrackedKeyphrases(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			toggleKeyphraseTracking,
			setWincherKeyphraseTracking,
		} = dispatch( "yoast-seo/editor" );

		return {
			toggleTrackAll: () => {
				toggleKeyphraseTracking();
			},
			setIsTrackingAll: ( isTracking ) => {
				setWincherKeyphraseTracking( isTracking );
			},
		};
	} ),
] )( WincherPostPublish );
