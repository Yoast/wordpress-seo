import React from 'react';

import Components from './components';

/**
 * Represents a step.
 */
class Step extends React.Component {

	/**
	 * Initializes the step component.
	 *
	 * @param props
	 */
	constructor( props ) {
		super();

		this.props = props;
	}

	/**
	 * Renders the current step.
	 *
	 * @returns {XML}
	 */
	render() {
		let fields = this.props.fields;
		let fieldKeys = Object.keys( fields );


		console.log( fields );

		return (
			<div>
				<h1>{this.props.title}</h1>
				{fieldKeys.map( function ( configName, index ) {
					let config = fields[configName];

					if( Components[config.component] ) {
						config.key       = index;
						config.fieldName = configName;
						
						return React.createElement( Components[config.component], config );
					}
				} )}
			</div>
		)
	}
}

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string,
	fields: React.PropTypes.object
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: {}
};

export default Step;