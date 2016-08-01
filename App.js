import React from "react";

import Wizard from './js/wizard'
import Config from './js/config';

class App extends React.Component {

	render() {
		return (
			<Wizard {...Config} />
		)
	}
}

export default App;
