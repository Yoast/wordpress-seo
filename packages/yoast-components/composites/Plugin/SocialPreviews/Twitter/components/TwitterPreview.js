/* External dependencies */
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import TwitterTitle from "./TwitterTitle";

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
		</Fragment>
	);
};

TwitterPreview.propTypes = {
	title: PropTypes.string.isRequired,
};

TwitterPreview.defaultProps = {
};

export default TwitterPreview;
