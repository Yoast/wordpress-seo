import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./composites/OnboardingWizard/OnboardingWizard";
import Config from "./composites/OnboardingWizard/config/production-config";

// Required to make Material UI work with touch screens.
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

class App extends React.Component {

	render() {
		return (
			<Wizard {...Config} />
		);
	}
}

ReactDOM.render( <App />, document.getElementById( 'container' ) );
