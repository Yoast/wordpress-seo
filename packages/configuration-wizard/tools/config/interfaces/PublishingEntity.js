/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

/**
 * Represents a publishing entity interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX} The publishing entity component.
 * @constructor
 */
const PublishingEntity = ( props ) => {
	const data = props.data;

	return (
		<div>
			<h2>{ data.publishingEntityType }</h2>
		</div>
	);
};

PublishingEntity.propTypes = {
	data: PropTypes.string,
};

PublishingEntity.defaultProps = {
	data: "",
};

export default PublishingEntity;
