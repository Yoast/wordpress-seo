import { __ } from "@wordpress/i18n";
import { DismissibleAlert } from "./dismissible-alert";

/**
 * The notice shown when a selection carried over from a WP admin overview contained items the bulk editor
 * cannot show or edit: those were dropped from the selection. Renders nothing while nothing was dropped.
 *
 * @param {Object}   props               The props.
 * @param {boolean}  props.hasExclusions Whether carried-over items were dropped from the selection.
 * @param {Function} props.onDismiss     Dismisses the notice.
 *
 * @returns {?JSX.Element} The notice, or null while nothing was dropped.
 */
export const OverviewExclusionNotice = ( { hasExclusions, onDismiss } ) => {
	if ( ! hasExclusions ) {
		return null;
	}

	return (
		<DismissibleAlert onDismiss={ onDismiss }>
			<span className="yst-block yst-pe-8">
				{ __( "Your selection has been updated. Private, password-protected, or non-indexed items can't be bulk edited and were excluded.", "wordpress-seo" ) }
			</span>
		</DismissibleAlert>
	);
};
