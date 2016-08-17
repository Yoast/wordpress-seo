import React from 'react';
import ReactDOM from 'react-dom';

import SearchResultEditor from "./composites/SearchResultEditor/SearchResultEditor";

class App extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<SearchResultEditor />
		)
	}
};

ReactDOM.render( <App />, document.getElementById( 'container' ) );

export default App;
