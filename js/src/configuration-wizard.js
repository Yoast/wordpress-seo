import React from "react";
import ReactDOM from "react-dom";
import {OnboardingWizard, Config} from "yoast-components";
import cloneDeep from "lodash/cloneDeep";

// Required to make Material UI work with touch screens.
var injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

class App extends React.Component {

	cloneConfiguration() {
		let config = cloneDeep( Config );
		return config;
	}

	render(){
		let config = this.cloneConfiguration();

		return(
			<div>
				<OnboardingWizard {...config}/>
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('wizard'));