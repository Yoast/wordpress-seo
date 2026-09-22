import { useDispatch, useSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Table } from "@yoast/ui-library";
import { PAGE_SIZE, STORE_NAME } from "../constants";

/**
 * The results footer: a "Showing X to Y of Z results" summary and the page navigation.
 *
 * Self-contained on the store like the search box: it reads the current page and dispatches
 * page changes itself, so the counts are the only thing the parent has to pass down.
 *
 * @param {Object}  props            The props.
 * @param {number}  props.colSpan    Number of columns the footer cell should span.
 * @param {number}  props.total      The total number of results across all pages.
 * @param {number}  props.totalPages The total number of pages.
 * @param {boolean} props.isPending  Whether a fetch is in flight (disables navigation to avoid double-clicks).
 *
 * @returns {JSX.Element|null} The footer, or null when there are no results.
 */
export const BulkEditorFooter = ( { colSpan, total, totalPages, isPending } ) => {
	const page = useSelect( ( select ) => select( STORE_NAME ).selectPage(), [] );
	const { requestSwitch } = useDispatch( STORE_NAME );

	// A page change is a guarded switch when there are unsaved edits or AI pending changes.
	const onNavigate = useCallback( ( target ) => requestSwitch( { kind: "page", target } ), [ requestSwitch ] );

	// Nothing to summarise or page through; the table itself shows the "no content" message.
	if ( total === 0 ) {
		return null;
	}

	const from = ( page - 1 ) * PAGE_SIZE + 1;
	const to = Math.min( page * PAGE_SIZE, total );

	const summary = createInterpolateElement(
		sprintf(
			/* translators: %1$s is the first result number, %2$s the last result number, %3$s the total number of results. */
			_n(
				"Showing %1$s to %2$s of %3$s result",
				"Showing %1$s to %2$s of %3$s results",
				total,
				"wordpress-seo"
			),
			"<from/>",
			"<to/>",
			"<total/>"
		),
		{
			from: <span className="yst-font-semibold">{ from }</span>,
			to: <span className="yst-font-semibold">{ to }</span>,
			total: <span className="yst-font-semibold">{ total }</span>,
		}
	);

	return (
		<Table.Pagination
			colSpan={ colSpan }
			page={ page }
			totalPages={ totalPages }
			onNavigate={ onNavigate }
			summary={ summary }
			disabled={ isPending }
			className="yst-content-type-pagination"
			/* translators: Hidden accessibility label for the pagination navigation landmark. */
			aria-label={ __( "Results pagination", "wordpress-seo" ) }
			/* translators: Hidden accessibility text. */
			screenReaderTextPrevious={ __( "Previous", "wordpress-seo" ) }
			/* translators: Hidden accessibility text. */
			screenReaderTextNext={ __( "Next", "wordpress-seo" ) }
		/>
	);
};
