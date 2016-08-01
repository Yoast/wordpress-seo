import React from 'react';

/**
 * Renders a step in the wizard process
 *
 * @param {Object} props The props used for rendering the steps.
 * @returns {JSX}
 * @constructor
 */
const Step = ( props ) => {

	let fields = props.fields;
	let fieldKeys = Object.keys( fields );

	return (
		<div>
			<h1>Step: {props.title}</h1>
			{
				fieldKeys.map(
					function ( configName, index ) {
						let config = fields[configName];

						if( props.components[config.component] ) {
							config.key       = index;
							config.fieldName = configName;

							return React.createElement( props.components[config.component], config );
						}
					}
				)
			}
		</div>
	)
};

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string.isRequired,
	fields: React.PropTypes.object
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: {}
};

export default Step;