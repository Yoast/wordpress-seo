import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import MetaboxFill from "../components/fills/MetaboxFill";

export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			getPreferences,
		} = select( "yoast-seo/editor" );

		return {
			settings: getPreferences(),
			store: ownProps.store,
		};
	} ),
] )( MetaboxFill );
