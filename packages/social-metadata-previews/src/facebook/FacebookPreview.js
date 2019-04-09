/* External dependencies */
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import FacebookSiteAndAuthorNames from "./FacebookSiteAndAuthorNames";
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
			<FacebookSiteAndAuthorNames siteName={ props.siteName } authorName={ props.authorName } />
			<FacebookTitle title={ props.title } />
			<FacebookDescription>
				{ props.description }
			</FacebookDescription>
		</Fragment>
	);
};

FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	authorName: PropTypes.string,
	description: PropTypes.string,
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

FacebookPreview.defaultProps = {
	authorName: "",
	description: "",
	alt: "",
};

export default FacebookPreview;
