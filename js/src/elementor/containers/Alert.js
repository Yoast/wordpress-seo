import { Alert } from "@yoast/components";
import { withSelect } from "@wordpress/data";

function WrappedAlert( props ) {
	return ( props.message.length === 0 ? null : <Alert type={ props.type }>{ props.message }</Alert> );
}

export default withSelect( select => {
	const {
		getWarningMessage,
	} = select( "yoast-seo/editor" );

	return {
		message: getWarningMessage(),
		type: "warning",
	};
} )( WrappedAlert );

