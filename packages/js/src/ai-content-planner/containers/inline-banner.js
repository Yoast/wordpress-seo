import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { InlineBanner } from "../components/inline-banner";
import { STORE_NAME } from "../store";

export default compose( [
	withSelect( select => ( {
		isPremium: select( "yoast-seo/editor" ).getIsPremium(),
	} ) ),

	withDispatch( dispatch => ( {
		onDismiss: dispatch( STORE_NAME ).dismissBanner,
	} ) ),
] )( InlineBanner );
