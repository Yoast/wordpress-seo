import React from "react";
import PropTypes from "prop-types";

import FacebookSiteName from "./FacebookSiteName";


/**
 * Renders a FacebookPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 *
 * @constructor
 */
const FacebookPreview = ( props ) => {
	return (
		<FacebookSiteName siteName={ props.siteName } />
	);
};

FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
};

export default FacebookPreview;
