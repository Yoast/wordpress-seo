import React from 'react';
import ReactDOM from 'react-dom';

import SearchResultPreview from './composites/SearchResultPreview/SearchResultPreview';

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			value: 'hoi',
			readOnly: '',
		}
	}

	render() {
		let optionalAttributes = {
			className: 'je moeder',
			placeholder: 'ok doei',
			id: 'hoi diede',
			value: this.state.value,
		};

		let hoi = {
			placeholder: "hoi"
		};

		let op2 = Object.assign({}, optionalAttributes);

		op2.readOnly = true;

		return (
			<div>
				<SearchResultPreview />
			</div>
		)
	}
};

ReactDOM.render( <App />, document.getElementById( 'container' ) );

export default App;
