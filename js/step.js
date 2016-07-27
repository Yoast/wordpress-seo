import React from 'react';
import GenericComponent from './genericComponent';
import TextInput from './input';
import Choice from './choice';

class Step extends React.Component {

	constructor( props ) {
		super();
		this.state = props;
	}

	render() {
		let options = {
			'test': {
				label: 'Label',
				screendReaderText: 'srt'
			},
			'test2': {
				label: 'Label2',
				screendReaderText: 'srt'
			}
		}

		return (
			<div>
				<GenericComponent>{this.props.title}</GenericComponent>
				<TextInput label="Test input" name="test" placeholder="vul dit in"/>
				<Choice options={options}/>
			</div>
		)
	}
}

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string,
	field: React.PropTypes.array
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: []
};

export default Step;