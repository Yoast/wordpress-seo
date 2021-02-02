import { Alert } from "@yoast/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";

/**
 * Renders the PersistentDismissableAlert component.
 *
 * @param {Object} props The props for the PersistentDismissableAlert.
 *
 * @returns {ReactElement} The PersistentDismissableAlert component.
 */
export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			isAlertDismissed,
		} = select( "yoast-seo/editor");

		return {
			isAlertDismissed: isAlertDismissed( ownProps.alertKey ),
		};
	} ),

	withDispatch( ( dispatch, ownProps ) => {
		const {
			dismissAlert,
		} = dispatch( "yoast-seo/editor" );

		return {
			onDismissed: () => dismissAlert( ownProps.alertKey ),
		};
	} ),
] )( Alert );
