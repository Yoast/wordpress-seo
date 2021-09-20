import { createInterpolateElement } from "@wordpress/element";
import classNames from "classnames";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * The Pagination Component.
 * @param {string} className The additional classes.
 * @param {number} currentPage The number of the current page.
 * @param {function} nextPage Callback for when the user clicks on the nextPage button.
 * @param {function} previousPage Callback for when the user clicks on the previousPage button.
 * @param {number} totalPages The total number of pages.
 * @returns {*} The Pagination Component.
 */
export default function Pagination( { className, currentPage, nextPage, previousPage, totalPages } ) {
	return (
		<nav
			className={ classNames(
				"yst-flex yst-items-center yst-justify-between",
				className,
			) }
			aria-label="Pagination"
		>
			<div className="yst-hidden sm:yst-block">
				<p className="yst-text-sm yst-text-gray-700">
					{ createInterpolateElement(
						/* translators: the first %s expands to the current page, the second %s expands to the total number of pages. */
						sprintf( __( "Showing page %s of %s", "admin-ui" ), `<span>${ currentPage }</span>`, `<span>${ totalPages }</span>`  ),
						{
							span: <span className="yst-font-medium" />,
						},
					) }
				</p>
			</div>
			<div className="yst-flex-1 yst-flex yst-justify-between sm:yst-justify-end">
				{ currentPage > 1 &&
					<button
						onClick={ previousPage }
						className="yst-relative yst-inline-flex yst-items-center yst-px-4 yst-py-2 yst-border yst-border-gray-300 yst-text-sm yst-font-medium yst-rounded-md yst-text-gray-700 yst-bg-white hover:yst-bg-gray-50"
					>
						{ __( "Previous", "admin-ui" ) }
					</button>
				}
				{ currentPage !== totalPages &&
					<button
						onClick={ nextPage }
						className="yst-ml-3 yst-relative yst-inline-flex yst-items-center yst-px-4 yst-py-2 yst-border yst-border-gray-300 yst-text-sm yst-font-medium yst-rounded-md yst-text-gray-700 yst-bg-white hover:yst-bg-gray-50"
					>
						{ __( "Next", "admin-ui" ) }
					</button>
				}
			</div>
		</nav>
	);
}

Pagination.propTypes = {
	className: PropTypes.string,
	currentPage: PropTypes.number.isRequired,
	nextPage: PropTypes.func.isRequired,
	previousPage: PropTypes.func.isRequired,
	totalPages: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
	className: "",
};
