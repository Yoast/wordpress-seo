import React from 'react';
import GenericComponent from './components/genericComponent';
import TextInput from './components/input';
import Choice from './components/choice';


let Components = {
	'Choice': Choice
};

class Step extends React.Component {

	constructor( props ) {
		super();

		this.props = props;
	}

	componentWillUnmount() {
//		React.unmountComponentAtNode( document.getElementsByClassName( 'form-row' ) );
	}

	render() {
		let fields = this.props.fields;
		let fieldKeys = Object.keys( fields );

		return (
			<div>
				<h1>{this.props.title}</h1>
				{fieldKeys.length > 0 && fieldKeys.map( function ( configName, index ) {
					let config = fields[configName];
					config.key = index;
					return React.createElement( Components[config.component], config );
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