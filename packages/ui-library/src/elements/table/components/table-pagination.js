import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Pagination from "../../../components/pagination";
import useMediaQuery from "../../../hooks/use-media-query";

/**
 * Returns the effective max page buttons: the caller's value when provided, otherwise 6 on large (≥640 px)
 * viewports and 5 on small ones.
 *
 * @param {number|undefined} maxPageButtons Caller-supplied cap, or undefined for the responsive default.
 *
 * @returns {number} The resolved cap.
 */
const useResponsiveMaxPageButtons = ( maxPageButtons ) => {
	const { matches: isLarge } = useMediaQuery( "(min-width: 640px)" );
	if ( maxPageButtons !== undefined ) {
		return maxPageButtons;
	}
	return isLarge ? 6 : 5;
};

/**
 * @param {Object}      props
 * @param {JSX.Element} [props.summary]
 * @param {boolean}     props.showPager
 * @param {number}      props.page
 * @param {number}      props.totalPages
 * @param {Function}    props.onNavigate
 * @param {number}      props.effectiveMaxPageButtons
 * @param {boolean}     props.disabled
 * @param {string}      props.screenReaderTextPrevious
 * @param {string}      props.screenReaderTextNext
 * @param {Object}      props.paginationProps
 * @returns {JSX.Element}
 */
const PaginationContent = ( {
	summary, showPager, page, totalPages, onNavigate,
	effectiveMaxPageButtons, disabled, screenReaderTextPrevious, screenReaderTextNext,
	...paginationProps
} ) => (
	<div className="yst-flex yst-items-center yst-justify-between">
		{ summary && <p className="yst-text-sm yst-text-slate-600">{ summary }</p> }
		{ showPager && <Pagination
			className={ classNames(
				"max-sm:yst-flex max-sm:yst-w-full max-sm:[&>*]:yst-flex-1 max-sm:[&_button]:yst-justify-center max-sm:[&_button]:!yst-px-1",
				{ "yst-ms-auto": ! summary },
			) }
			current={ page }
			total={ totalPages }
			onNavigate={ onNavigate }
			maxPageButtons={ effectiveMaxPageButtons }
			disabled={ disabled }
			screenReaderTextPrevious={ screenReaderTextPrevious }
			screenReaderTextNext={ screenReaderTextNext }
			{ ...paginationProps }
		/> }
	</div>
);

/**
 * A pagination footer for a table card.
 *
 * By default (`as="tfoot"`) it renders as a `<tfoot>` row inside the `<table>`.
 * Pass `as="div"` when the component is placed outside the `<table>` element
 * (e.g. via `Table`'s `footer` prop) so the output is a plain `<div>`.
 *
 * @param {Object}        props
 * @param {number}        [props.colSpan]                  Number of columns to span. Required for `as="tfoot"`.
 * @param {number}        props.page                       The current page (1-based).
 * @param {number}        props.totalPages                 Total number of pages.
 * @param {Function}      props.onNavigate                 Called with the target page number when the user navigates.
 * @param {string}        props.screenReaderTextPrevious   Accessible label for the "previous" button.
 * @param {string}        props.screenReaderTextNext       Accessible label for the "next" button.
 * @param {JSX.Element}   [props.summary]                  Optional "Showing X to Y of Z results" node rendered on the left.
 * @param {number}        [props.maxPageButtons]           Maximum page buttons to show. Defaults to 6 on large (≥640 px) and 5 on small viewports.
 * @param {boolean}       [props.disabled]                 Whether pagination buttons are disabled.
 * @param {string}        [props.className]                Extra class names for the footer cell or div.
 * @param {"tfoot"|"div"} [props.as]                      Render as a `<tfoot>` row (default) or a plain `<div>`.
 *
 * @returns {JSX.Element|null} The footer, or null when there is nothing to show (no summary and at most one page).
 */
const TablePagination = ( {
	colSpan,
	page,
	totalPages,
	onNavigate,
	screenReaderTextPrevious,
	screenReaderTextNext,
	summary = null,
	maxPageButtons = undefined,
	disabled = false,
	className = "",
	as = "tfoot",
	...paginationProps
} ) => {
	const effectiveMaxPageButtons = useResponsiveMaxPageButtons( maxPageButtons );
	const showPager = totalPages > 1;

	if ( ! showPager && ! summary ) {
		return null;
	}

	const contentProps = {
		summary, showPager, page, totalPages, onNavigate,
		effectiveMaxPageButtons, disabled, screenReaderTextPrevious, screenReaderTextNext,
		...paginationProps,
	};

	if ( as === "div" ) {
		return (
			<div className={ classNames( "yst-px-3 yst-py-4 yst-text-sm yst-text-slate-600 yst-border-t yst-border-slate-200 yst-bg-white yst-rounded-es-lg yst-rounded-ee-lg", className ) }>
				<PaginationContent { ...contentProps } />
			</div>
		);
	}

	return (
		<tfoot>
			<tr className="yst-table-row">
				<td colSpan={ colSpan } className={ classNames( "yst-table-cell yst-border-t yst-border-slate-200 yst-bg-white yst-rounded-es-lg yst-rounded-ee-lg", className ) }>
					<PaginationContent { ...contentProps } />
				</td>
			</tr>
		</tfoot>
	);
};

TablePagination.propTypes = {
	colSpan: PropTypes.number,
	as: PropTypes.oneOf( [ "tfoot", "div" ] ),
	page: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onNavigate: PropTypes.func.isRequired,
	screenReaderTextPrevious: PropTypes.string.isRequired,
	screenReaderTextNext: PropTypes.string.isRequired,
	summary: PropTypes.node,
	maxPageButtons: PropTypes.number,
	disabled: PropTypes.bool,
	className: PropTypes.string,
};


export { TablePagination };
