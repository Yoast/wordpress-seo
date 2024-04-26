import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import ElementorFill from "../components/fills/ElementorFill";

/* eslint-disable complexity */
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
/* eslint-enable complexity */
