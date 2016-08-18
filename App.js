import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./composites/onboarding-wizard/wizard";
import Config from "./composites/onboarding-wizard/config/config";

class App extends React.Component {

	render() {
		return (
			<Wizard {...Config} />
		);
	}
}

ReactDOM.render( <App />, document.getElementById( 'container' ) );
