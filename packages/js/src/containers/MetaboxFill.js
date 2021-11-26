import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import MetaboxFill from "../components/fills/MetaboxFill";

export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			getPreferences,
			getWincherTrackableKeyphrases,
		} = select( "yoast-seo/editor" );

		return {
			settings: getPreferences(),
			store: ownProps.store,
			wincherKeyphrases: getWincherTrackableKeyphrases(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setWincherNoKeyphrase } = dispatch( "yoast-seo/editor" );
		return {
			setWincherNoKeyphrase,
		};
	} ),
] )( MetaboxFill );
