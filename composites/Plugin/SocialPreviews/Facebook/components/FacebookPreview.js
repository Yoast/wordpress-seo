import React, { Fragment } from "react";
import PropTypes from "prop-types";

import FacebookSiteName from "./FacebookSiteName";
import FacebookImage from "./FacebookImage";

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
		<Fragment>
			<FacebookImage src={ props.src } />
			<FacebookSiteName siteName={ props.siteName } />
		</Fragment>
	);
};

FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
};

export default FacebookPreview;
