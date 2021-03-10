import { withSelect } from "@wordpress/data";
import MetaboxFill from "../components/fills/metabox-fill";

export default withSelect( ( select, ownProps ) => {
	const { getPreferences } = select( "yoast-seo/editor" );

	return {
		settings: getPreferences(),
		store: ownProps.store,
	};
} )( MetaboxFill );
