import { withSelect } from "@wordpress/data";
import SidebarFill from "../components/fills/SidebarFill";

export default withSelect( ( select, ownProps ) => {
	const { getPreferences } = select( "yoast-seo/editor" );

	return {
		settings: getPreferences(),
		store: ownProps.store,
	};
} )( SidebarFill );
