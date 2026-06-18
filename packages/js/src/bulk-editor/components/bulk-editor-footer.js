import { useDispatch, useSelect } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Pagination, useMediaQuery } from "@yoast/ui-library";
import { PAGE_SIZE, STORE_NAME } from "../constants";

// Page buttons to show per breakpoint. On mobile the pager spans the full width, so there is room for
// a few buttons; on desktop it sits inline next to the results summary and matches the design. Keyed to Tailwind's `sm`.
const MAX_PAGE_BUTTONS_LARGE = 6;
const MAX_PAGE_BUTTONS_SMALL = 5;

/**
 * The results footer: a "Showing X to Y of Z results" summary and the page navigation.
 *
 * Self-contained on the store like the search box: it reads the current page and dispatches
 * page changes itself, so the counts are the only thing the parent has to pass down.
 *
 * @param {Object}  props            The props.
 * @param {number}  props.total      The total number of results across all pages.
 * @param {number}  props.totalPages The total number of pages.
 * @param {boolean} props.isPending  Whether a fetch is in flight (disables navigation to avoid double-clicks).
 *
 * @returns {JSX.Element|null} The footer, or null when there are no results.
 */
export const BulkEditorFooter = ( { total, totalPages, isPending } ) => {
	const page = useSelect( ( select ) => select( STORE_NAME ).selectPage(), [] );
	const { setPage } = useDispatch( STORE_NAME );
	const { matches: isLarge } = useMediaQuery( "(min-width: 640px)" );

	// Nothing to summarise or page through; the table itself shows the "no content" message.
	if ( total === 0 ) {
		return null;
	}

	const from = ( page - 1 ) * PAGE_SIZE + 1;
	const to = Math.min( page * PAGE_SIZE, total );

	return (
		<div className="yst-flex yst-items-center yst-justify-between yst-border-t yst-border-slate-200 yst-pt-4">
			<p className="yst-hidden sm:yst-block yst-text-sm yst-text-slate-700">
				{ createInterpolateElement(
					sprintf(
						/* translators: %1$s is the first result number, %2$s the last result number, %3$s the total number of results. */
						__( "Showing %1$s to %2$s of %3$s results", "wordpress-seo" ),
						"<from/>",
						"<to/>",
						"<total/>"
					),
					{
						from: <span className="yst-font-semibold">{ from }</span>,
						to: <span className="yst-font-semibold">{ to }</span>,
						total: <span className="yst-font-semibold">{ total }</span>,
					}
				) }
			</p>
			<Pagination
				// On mobile the pager fills the row: stretch the nav full width and let each button grow
				// equally with slim padding so multi-digit page numbers fit. Desktop keeps the inline pill.
				className="max-sm:yst-flex max-sm:yst-w-full max-sm:[&>*]:yst-flex-1 max-sm:[&_button]:yst-justify-center max-sm:[&_button]:!yst-px-1"
				/* translators: Hidden accessibility label for the pagination navigation landmark. */
				aria-label={ __( "Results pagination", "wordpress-seo" ) }
				current={ page }
				total={ totalPages }
				onNavigate={ setPage }
				maxPageButtons={ isLarge ? MAX_PAGE_BUTTONS_LARGE : MAX_PAGE_BUTTONS_SMALL }
				disabled={ isPending }
				/* translators: Hidden accessibility text. */
				screenReaderTextPrevious={ __( "Previous", "wordpress-seo" ) }
				/* translators: Hidden accessibility text. */
				screenReaderTextNext={ __( "Next", "wordpress-seo" ) }
			/>
		</div>
	);
};
