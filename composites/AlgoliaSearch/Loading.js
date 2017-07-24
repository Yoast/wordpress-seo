import React from "react";
import PropTypes from "prop-types";

/**
 * Creates the JSX to render a loading indicator.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A div with a loading indicator.
 * @constructor
 */
const Loading = ( props ) => {
	return ( <div className="wpseo-kb-loader">{ props.loadingPlaceholder }</div> );
};

Loading.propTypes = {
	loadingPlaceholder: PropTypes.string.isRequired,
};

export default Loading;
