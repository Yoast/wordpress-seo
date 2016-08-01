import React from 'react';

/**
 * Represents a posttype visibility component.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX}
 * @constructor
 */
const PostTypeVisibility = ( props ) => {
	return (
		<div>
			<h2>{props.properties.label}</h2>
		</div>
	);
};

PostTypeVisibility.propTypes = {
	component: React.PropTypes.string,
	properties: React.PropTypes.object,
	data: React.PropTypes.object
};

PostTypeVisibility.defaultProps = {
	component: '',
	properties: {},
	data: {}
};

export default PostTypeVisibility;