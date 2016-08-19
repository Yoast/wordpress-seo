import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./composites/OnboardingWizard/OnboardingWizard";
import Config from "./composites/OnboardingWizard/config/production-config";

class App extends React.Component {

	render() {
		return (
			<Wizard {...Config} />
		);
	}
}

ReactDOM.render( <App />, document.getElementById( 'container' ) );
