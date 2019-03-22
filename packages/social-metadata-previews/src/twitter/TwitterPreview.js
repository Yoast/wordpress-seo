/* External dependencies */
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import TwitterTitle from "./TwitterTitle";
import TwitterDescription from "./TwitterDescription";
import TwitterSiteName from "./TwitterSiteName";

/**
 * Renders a TwitterPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterPreview = ( props ) => {
	return (
		<Fragment>
			<TwitterTitle title={ props.title } />
			<TwitterDescription description={ props.description } />
			<TwitterSiteName siteName={ props.siteName } />
		</Fragment>
	);
};

TwitterPreview.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	siteName: PropTypes.string.isRequired,
};

TwitterPreview.defaultProps = {
	description: "",
};

export default TwitterPreview;
