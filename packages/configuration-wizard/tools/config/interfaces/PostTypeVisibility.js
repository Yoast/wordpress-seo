/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

/**
 * Represents a post type visibility component.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX} The post type visibility component.
 * @constructor
 */
const PostTypeVisibility = ( props ) => {
	return (
		<div>
			<h2>{ props.properties.label }</h2>
		</div>
	);
};

PostTypeVisibility.propTypes = {
	properties: PropTypes.object,
};

PostTypeVisibility.defaultProps = {
	properties: {},
};

export default PostTypeVisibility;
