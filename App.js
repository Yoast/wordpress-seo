import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./onboarding-wizard/wizard";
import Config from "./onboarding-wizard/config/config";

class App extends React.Component {

	render() {
		return (
			<Wizard {...Config} />
		);
	}
}

ReactDOM.render( <App />, document.getElementById( 'container' ) );
