import { Alert } from "@yoast/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";

/**
 * Composes the PersistentDismissableAlert container.
 *
 * @returns {Component} The composed Alert component.
 */
export default compose( [
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
] )( Alert );
