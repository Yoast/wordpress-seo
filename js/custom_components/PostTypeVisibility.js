import React from 'react';

/**
 * Represents a posttype visibility component.
 */
class PostTypeVisibility extends React.Component {

	constructor() {
		super();
	}

	/**
	 * Renders the choice component with a label and its radio buttons.
	 *
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
				<h2>{this.props.properties.label}</h2>

			</div>
		)
	}
}

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