import React from "react";
import PropTypes from "prop-types";

/**
 * Explanation component.
 *
 * @param {string} props Properties for the component.
 *
 * @returns {JSX.Element|null} Returns a paragraph containing the explanation,
 *                             or null when the explanation is empty.
 *
 * @constructor
 */
const Explanation = ( props ) => {
	if ( typeof props.text !== "undefined" && props.text !== "" ) {
		return <p className="yoast-wizard-input__explanation">
			{ props.text }
		</p>;
	}
	return null;
};

Explanation.propTypes = {
	text: PropTypes.string,
};

export default Explanation;
