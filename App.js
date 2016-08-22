import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./composites/OnboardingWizard/OnboardingWizard";
import Config from "./composites/OnboardingWizard/config/production-config";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Required to make Material UI work with touch screens.
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const App = () => (
	<MuiThemeProvider>
		<Wizard {...Config} />
	</MuiThemeProvider>
);

ReactDOM.render( <App />, document.getElementById( 'container' ) );
