import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import ElementorFill from "../components/fills/ElementorFill";

export default compose( [
	withSelect( select => {
		const {
			getPreferences,
		} = select( "yoast-seo/editor" );

		return {
			settings: getPreferences(),
		};
	} ),
] )( ElementorFill );
