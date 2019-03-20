/* External dependencies */
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import FacebookSiteName from "./FacebookSiteName";
import FacebookImage from "./FacebookImage";
import FacebookTitle from "./FacebookTitle";
import FacebookDescription from "./FacebookDescription";

/**
 * Renders a FacebookPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookPreview = ( props ) => {
	return (
		<Fragment>
			<FacebookImage src={ props.src } alt={ props.alt } />
			<FacebookSiteName siteName={ props.siteName } />
			<FacebookTitle title={ props.title } />
			<FacebookDescription description={ props.description } />
		</Fragment>
	);
};

FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

FacebookPreview.defaultProps = {
	description: "",
	alt: "",
};

export default FacebookPreview;
