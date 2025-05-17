import PropTypes from "prop-types";
import React from "react";

/**
 * Displays the current / total as text.
 * @param {number} current The current page. Start at 1.
 * @param {number} total The total pages.
 * @returns {JSX.Element} The element.
 */
const DisplayText = ( { current, total } ) => (
	<bdo dir="ltr" className="yst-pagination-display__text">
		<span className="yst-pagination-display__current-text">{ current }</span> / { total }
	</bdo>
);

DisplayText.displayName = "Pagination.DisplayText";
DisplayText.propTypes = {
	current: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
};

export default DisplayText;
