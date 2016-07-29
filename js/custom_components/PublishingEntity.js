
import React from 'react';

/**
 * Represents a mailchimg signup interface.
 */
class PublishingEntity extends React.Component {

	constructor() {
		super();
	}

	/**
	 * Renders the choice component with a label and its radio buttons.
	 *
	 * @returns {XML}
	 */
	render() {
		let data = this.props.data;

		return (
			<div>
				<h2>{data.publishingEntityType}</h2>


			</div>
	)
	}
}

PublishingEntity.propTypes = {
	component: React.PropTypes.string,
	defaults: React.PropTypes.object,
	data: React.PropTypes.object
};

PublishingEntity.defaultProps = {
	component: '',
	defaults: {},
	data: {}
};

export default PublishingEntity;