import SolidXIcon from "@heroicons/react/solid/XIcon";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, useSvgAria } from "@yoast/ui-library";

/**
 * Builds the notice message.
 *
 * @param {string} noun The lowercase content type label, e.g. "posts".
 *
 * @returns {string} The notice message.
 */
const getMessage = ( noun ) => sprintf(
	/* translators: %s expands to the lowercase plural content type label, e.g. "posts". */
	__( "Your selection has been updated. Private, password-protected, or non-indexed %s can't be bulk edited and were excluded.", "wordpress-seo" ),
	noun
);

/**
 * The notice shown when a selection carried over from a WP admin overview contained items the bulk editor
 * cannot show or edit: those were dropped from the selection. Renders nothing while nothing was dropped.
 *
 * @param {Object}   props                    The props.
 * @param {boolean}  props.hasExclusions      Whether carried-over items were dropped from the selection.
 * @param {string}   [props.contentTypeLabel] The active content type label (plural), used in the copy.
 * @param {Function} props.onDismiss          Dismisses the notice.
 *
 * @returns {?JSX.Element} The notice, or null while nothing was dropped.
 */
export const OverviewExclusionNotice = ( { hasExclusions, contentTypeLabel, onDismiss } ) => {
	const svgAriaProps = useSvgAria();

	if ( ! hasExclusions ) {
		return null;
	}

	const noun = contentTypeLabel ? contentTypeLabel.toLowerCase() : __( "items", "wordpress-seo" );

	return (
		// The top margin separates this notice from the truncation notice above it; it cancels out when
		// nothing precedes it in the notices region (the truncation notice renders null when it does not apply).
		<Alert variant="info" as="div" role="status" className="yst-rounded-none yst-relative yst-mt-2 first:yst-mt-0">
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
