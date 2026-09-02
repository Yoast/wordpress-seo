import React from "react";
import classNames from "classnames";
import { Pagination } from "../../../index";

/**
 * @typedef {Object} PaginationProps
 * @property {number}   current                    The current page (1-based).
 * @property {number}   total                      The total number of pages. Pagination is only rendered when this is greater than 1.
 * @property {Function} onNavigate                 Called with the requested page number when the user navigates.
 * @property {string}   screenReaderTextPrevious   Screen reader label for the previous button.
 * @property {string}   screenReaderTextNext       Screen reader label for the next button.
 * @property {string}   [variant="buttons"]        Display variant — `"buttons"` or `"text"`.
 * @property {number}   [maxPageButtons=6]         Maximum number of page buttons to show (buttons variant only).
 * @property {boolean}  [disabled=false]           Whether the pagination buttons are disabled.
 */

/**
 * A list wrapper for `ContentTabs.TabButton`s. Optionally renders a `Pagination` component below
 * the tab buttons when `paginationProps.total > 1`.
 *
 * @param {React.ReactNode} children                  The tab buttons.
 * @param {string}          [className=""]            Extra class name for the wrapping element.
 * @param {PaginationProps} [paginationProps={}]      Props forwarded to `Pagination`. Kept as a
 *   separate object so it doesn't collide with the `...props` spread onto the outer wrapper.
 * @param {...any}          [props]                   Extra props, spread onto the wrapping element.
 *
 * @returns {JSX.Element} The list.
 */
export const TabList = ( { children, className = "", paginationProps = {}, ...props } ) => {
	return <div className={ classNames( "yst-content-tabs__tab-list", className ) } { ...props }>
		<ul className="yst-grow">{ children }</ul>
		{ paginationProps?.total > 1 && (
			<div className="yst-flex yst-justify-center yst-p-2">
				<Pagination
					{ ...paginationProps }
				/>
			</div>
		) }
	</div>;
};
