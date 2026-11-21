import { __, sprintf } from "@wordpress/i18n";
import { BULK_UPDATE_BATCH_SIZE } from "../constants";
import { DismissibleAlert } from "./dismissible-alert";

/**
 * The notice shown when the user arrived from a WP admin overview with more items selected than the
 * bulk editor can handle in one batch: only the first batch stays selected. Renders nothing while the
 * whole selection fits the batch.
 *
 * @param {Object}   props           The props.
 * @param {number}   props.total     The number of items that were selected on the overview.
 * @param {Function} props.onDismiss Dismisses the notice.
 *
 * @returns {?JSX.Element} The notice, or null when the whole selection fits the batch.
 */
export const OverviewSelectionNotice = ( { total, onDismiss } ) => {
	if ( total <= BULK_UPDATE_BATCH_SIZE ) {
		return null;
	}

	const message = sprintf(
		/* translators: %1$d expands to the maximum number of items at a time. */
		__( "Only the first %1$d items from your selection were carried over. The bulk editor supports up to %1$d items at a time.", "wordpress-seo" ),
		BULK_UPDATE_BATCH_SIZE
	);

	return (
		<DismissibleAlert onDismiss={ onDismiss }>
			<span className="yst-block yst-pe-8">{ message }</span>
		</DismissibleAlert>
	);
};
