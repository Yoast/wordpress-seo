import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import FrontendSidebar from "../component";

export default compose(
	[
		withSelect( ( select ) => {
			const data = select( "yoast-seo/frontend" ).getData();

			return { data };
		} ),
	]
)( FrontendSidebar );
