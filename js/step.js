import React from 'react';
import GenericComponent from './components/genericComponent';
import TextInput from './components/input';
import Choice from './components/choice';


let Components = {
	'Choice': Choice
}


class Step extends React.Component {

	constructor( props ) {
		super();
		this.state = props;
	}


	render() {
		let fields = this.state.fields;
		let fieldKeys = Object.keys( fields );

		return (
			<div>
				{fieldKeys.map( function ( configName, index ) {
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