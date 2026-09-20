import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Pagination from "../../../components/pagination";

/**
 * A `<tfoot>` row that sits inside the table card and carries the pagination controls.
 *
 * Placing pagination here (rather than outside the table) lets it inherit the card's border-radius
 * and keeps the visual boundary consistent with the rest of the table.
 *
 * @param {Object}      props
 * @param {number}      props.colSpan                      Number of columns the footer cell should span.
 * @param {number}      props.page                         The current page (1-based).
 * @param {number}      props.totalPages                   Total number of pages.
 * @param {Function}    props.onNavigate                   Called with the target page number when the user navigates.
 * @param {string}      props.screenReaderTextPrevious     Accessible label for the "previous" button.
 * @param {string}      props.screenReaderTextNext         Accessible label for the "next" button.
 * @param {JSX.Element} [props.summary]                    Optional "Showing X to Y of Z results" node rendered on the left.
 * @param {number}      [props.maxPageButtons]             Maximum page buttons to show (passed to Pagination).
 * @param {boolean}     [props.disabled]                   Whether pagination buttons are disabled.
 * @param {string}      [props.className]                  Extra class names for the footer cell.
 *
 * @returns {JSX.Element|null} The footer, or null when there is only one page or none.
 */
const TablePagination = ( {
	colSpan,
	page,
	totalPages,
	onNavigate,
	screenReaderTextPrevious,
	screenReaderTextNext,
	summary,
	maxPageButtons,
	disabled,
	className,
	...paginationProps
} ) => {
	if ( totalPages <= 1 ) {
		return null;
	}

	return (
		<tfoot>
			<tr className="yst-table-row">
				<td
					colSpan={ colSpan }
					className={ classNames(
						"yst-table-cell yst-border-t yst-border-slate-200 yst-bg-white yst-rounded-es-lg yst-rounded-ee-lg",
						className,
					) }
				>
					<div className="yst-flex yst-items-center yst-justify-between">
						{ summary && <p className="yst-text-sm yst-text-slate-600">{ summary }</p> }
						<Pagination
							className={ classNames(
								"max-sm:yst-flex max-sm:yst-w-full max-sm:[&>*]:yst-flex-1 max-sm:[&_button]:yst-justify-center max-sm:[&_button]:!yst-px-1",
								{ "yst-ms-auto": ! summary },
							) }
							current={ page }
							total={ totalPages }
							onNavigate={ onNavigate }
							maxPageButtons={ maxPageButtons }
							disabled={ disabled }
							screenReaderTextPrevious={ screenReaderTextPrevious }
							screenReaderTextNext={ screenReaderTextNext }
							{ ...paginationProps }
						/>
					</div>
				</td>
			</tr>
		</tfoot>
	);
};

TablePagination.propTypes = {
	colSpan: PropTypes.number.isRequired,
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

TablePagination.defaultProps = {
	summary: null,
	maxPageButtons: 6,
	disabled: false,
	className: "",
};

export { TablePagination };
