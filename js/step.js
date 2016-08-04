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
		<form id="stepContainer">
			<h1>Step: {props.title}</h1>
			{
				fieldKeys.map(
					function ( configName, index ) {
						let config = fields[ configName ];

						if ( props.components[ config.component ] ) {
							config.key = index;
							config.fieldName = configName;

							return React.createElement( props.components[ config.component ], config );
						}
					}
				)
			}
		</form>
	)
};

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string.isRequired,
	fields: React.PropTypes.object,
	components: React.PropTypes.object
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: {},
	components: {}

};

export default Step;