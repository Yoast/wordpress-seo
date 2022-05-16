import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import FrontendSidebar from "../component";

export default compose(
	[
		withSelect( ( select ) => {
			const data = select( "yoast-seo/frontend" ).getData();

			return { data };
		} ),
		withDispatch(
			( dispatch ) => {
				const {
					addLinks,
				} = dispatch( "yoast-seo/frontend" );

				return {
					addLinks,
				};
			}
		),
	]
)( FrontendSidebar );
