import React from "react";
import PropTypes from "prop-types";

/**
 * Creates an IFrame component.
 *
 * @param {Object} props The props to use with the component.
 *
 * @returns {ReactElement} The rendered IFrame component.
 *
 * @constructor
 */
export default function IFrame( props ) {
	return ( <iframe title={ props.title } { ...props } /> );
}

IFrame.propTypes = {
	title: PropTypes.string.isRequired,
};
