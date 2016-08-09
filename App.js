import React from 'react';
import ReactDOM from 'react-dom';

import SearchResultPreview from './composites/SearchResultPreview/SearchResultPreview';

class App extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<div>
				<SearchResultPreview />
			</div>
		)
	}
};

ReactDOM.render( <App />, document.getElementById( 'container' ) );

export default App;
