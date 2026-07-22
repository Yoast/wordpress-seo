import SolidXIcon from "@heroicons/react/solid/XIcon";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, useSvgAria } from "@yoast/ui-library";
import { BULK_UPDATE_BATCH_SIZE } from "../constants";

/**
 * Builds the notice message.
 *
 * @param {string} noun The lowercase content type label, e.g. "posts".
 *
 * @returns {string} The notice message.
 */
const getMessage = ( noun ) => sprintf(
	/* translators: %1$d expands to the maximum number of items at a time, %2$s to the lowercase content type label, e.g. "posts". */
	__( "Only the first %1$d %2$s from your selection were carried over. The bulk editor supports up to %1$d %2$s at a time.", "wordpress-seo" ),
	BULK_UPDATE_BATCH_SIZE,
	noun
);

/**
 * The notice shown when the user arrived from a WP admin overview with more items selected than the
 * bulk editor can handle in one batch: only the first batch stays selected. Renders nothing while the
 * whole selection fits the batch.
 *
 * @param {Object}   props                    The props.
 * @param {number}   props.total              The number of items that were selected on the overview.
 * @param {string}   [props.contentTypeLabel] The active content type label (plural), used in the copy.
 * @param {Function} props.onDismiss          Dismisses the notice.
 *
 * @returns {?JSX.Element} The notice, or null when the whole selection fits the batch.
 */
export const OverviewSelectionNotice = ( { total, contentTypeLabel, onDismiss } ) => {
	const svgAriaProps = useSvgAria();

	if ( total <= BULK_UPDATE_BATCH_SIZE ) {
		return null;
	}

	const noun = contentTypeLabel ? contentTypeLabel.toLowerCase() : __( "items", "wordpress-seo" );

	return (
		<Alert variant="info" as="div" role="status" className="yst-rounded-none yst-relative">
			<span className="yst-block yst-pe-8">{ getMessage( noun ) }</span>
			<button
				type="button"
				className="yst-absolute yst-end-4 yst-top-4 yst-text-current hover:yst-opacity-75 yst-cursor-pointer"
				onClick={ onDismiss }
				aria-label={ __( "Dismiss", "wordpress-seo" ) }
			>
				<SolidXIcon className="yst-h-5 yst-w-5" { ...svgAriaProps } />
			</button>
		</Alert>
	);
};
