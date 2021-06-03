import { withSelect } from "@wordpress/data";
import { Warning } from "@yoast/components";

export default withSelect( select => {
	const { getWarningMessage } = select( "yoast-seo/editor" );

	return { message: getWarningMessage() };
} )( Warning );
