import { withSelect } from "@wordpress/data";
import ElementorFill from "../components/fills/ElementorFill";

export default withSelect( ( select ) => {
	const { getPreferences } = select( "yoast-seo/editor" );

	return {
		settings: getPreferences(),
	};
} )( ElementorFill );
