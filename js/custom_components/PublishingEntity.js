
import React from 'react';

/**
 * Represents a mailchimg signup interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX}
 * @constructor
 */
const PublishingEntity = ( props ) => {

	let data = props.data;

	return (
		<div>
			<h2>{data.publishingEntityType}</h2>
		</div>
	);
}

PublishingEntity.propTypes = {
	component: React.PropTypes.string,
	defaults: React.PropTypes.object,
	data: React.PropTypes.string
};

PublishingEntity.defaultProps = {
	component: '',
	defaults: {},
	data: ''
};

export default PublishingEntity;