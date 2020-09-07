import { withSelect } from "@wordpress/data";
import ElementorFill from "../components/fills/ElementorFill";

export default withSelect( ( select ) => {
	const data = select( "yoast-seo/editor" );

	return {
		settings: data.getPreferences(),
	};
} )( ElementorFill );
