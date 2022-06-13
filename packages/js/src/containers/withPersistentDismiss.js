import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";

/**
 * Composes the withPersistentDismiss HOC.
 *
 * @returns {Function} The withPersistentDismiss HOC.
 */
const withPersistentDismiss = compose( [
	withSelect( ( select, ownProps ) => {
		const {
			isAlertDismissed,
		} = select( ownProps.store || "yoast-seo/editor" );

		return {
			isAlertDismissed: isAlertDismissed( ownProps.alertKey ),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const {
			dismissAlert,
		} = dispatch( ownProps.store || "yoast-seo/editor" );

		return {
			onDismissed: () => dismissAlert( ownProps.alertKey ),
		};
	} ),
] );

export default withPersistentDismiss;
