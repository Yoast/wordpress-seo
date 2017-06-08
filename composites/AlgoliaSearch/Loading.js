import React from "react";

/**
 * Creates the JSX to render a loading indicator.
 *
 * @param {object} props The React props.
 * @returns {JSX} A div with a loading indicator.
 * @constructor
 */
const Loading = ( props ) => {
	return (
		<div className="wpseo-kb-loader">{ props.loadingPlaceholder }</div>
	);
};

Loading.propTypes = {
	loadingPlaceholder: React.PropTypes.string.isRequired,
};

Loading.defaultProps = {
	loadingPlaceholder: "Loading...",
};

export default Loading;
