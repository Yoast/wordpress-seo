import React from 'react';

/**
 * Renders a step in the wizard process
 *
 * @param {Object} props The props used for rendering the steps.
 * @returns {JSX}
 * @constructor
 */
class Step extends React.Component {

	/**
	 * Sets the default state.
	 */
	constructor() {
		super();

		this.state = {
			fieldValues: {}
		};
	}

	/**
	 * Sets the field values for the given step.
	 */
	componentWillMount() {
		this.setFieldValues( this.props.fields, this.props.currentStep );
	}

	/**
	 * Sets the field values for the next step.
	 *
	 * @param {Object} nextProps
	 */
	componentWillReceiveProps( nextProps ) {
		this.setFieldValues( nextProps.fields, nextProps.currentStep );
	}

	/**
	 * Store the field values for the given step, when they aren't set yet.
	 *
	 * @param {Object} fields       The fields for the step.
	 * @param {string}  currentStep The name for the current step.
	 */
	setFieldValues( fields, currentStep ) {

		let fieldNames = Object.keys( fields );
		let fieldValues = this.state.fieldValues;

		if ( typeof fieldValues[ currentStep ] === typeof undefined ) {
			fieldValues[ currentStep ] = {};
		}

		fieldNames.forEach(
			function ( fieldName ) {
				if ( typeof fieldValues[ currentStep ][ fieldName ] === typeof undefined ) {
					fieldValues[ currentStep ][ fieldName ] = "";
				}

			}.bind( this )
		);

		this.setState( {
			currentStep, fieldValues
		} );

	}

	/**
	 * Runs the onchange event by update the value in the state.
	 *
	 * @param {Object} evt The event data.
	 */
	onChange( evt ) {

		let fieldValues = this.state.fieldValues;
		let fieldName = evt.target.name;

		// If the field value is undefined, add the fields to the field values.
		if ( typeof fieldValues[ this.state.currentStep ][ fieldName ] !== typeof undefined ) {
			fieldValues[ this.state.currentStep ][ fieldName ] = evt.target.value;
		}

		this.setState( {
			fieldValues
		} );
	}

	/**
	 * Renders a field for the current step.
	 *
	 * @param {string} configName The name of the config.
	 * @param {string} index      The index of the config value in the fields.
	 * @returns {Element}
	 */
	renderField( configName, index ) {
		let config = this.props.fields[ configName ];

		if ( this.props.components[ config.component ] ) {
			config.key = index;
			config.fieldName = configName;
			config.onChange = this.onChange.bind( this );
			config.data = this.state.fieldValues[ this.state.currentStep ][ configName ];
			
			return React.createElement( this.props.components[ config.component ], config );
		}

		return null;
	}

	/**
	 * Renders the step.
	 *
	 * @returns {JSX}
	 */
	render() {
		let fields = this.props.fields;
		let fieldKeys = Object.keys( fields );

		return (
			<div id="stepContainer">
				<h1>Step: {this.props.title}</h1>
				{
					fieldKeys.map( this.renderField.bind( this ) )
				}
			</div>
		)
	}
}
;

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string.isRequired,
	fields: React.PropTypes.object,
	components: React.PropTypes.object,
	currentStep: React.PropTypes.string
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: {},
	components: {},
	currentStep: ''
};

export default Step;