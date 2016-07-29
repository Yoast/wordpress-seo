import React from 'react';

/**
 * Represents a step in the wizard process
 */
class Step extends React.Component {

	/**
	 * Initializes the step component.
	 *
	 * @param {Object} props
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

		return (
			<div>
				<h1>{this.props.title}</h1>
				{fieldKeys.map(
					function ( configName, index ) {
						let config = fields[configName];

						if( this.props.components[config.component] ) {
							config.key       = index;
							config.fieldName = configName;

							return React.createElement( this.props.components[config.component], config );
						}
					}.bind(this)
				)}
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