import React from "react";
import ReactDOM from "react-dom";
import {OnboardingWizard} from "yoast-components";

// Required to make Material UI work with touch screens.
var injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

class App extends React.Component {

	render(){
		let config = "";

		jQuery.ajax( {
			url: `${yoastWizardConfig.root}${yoastWizardConfig.namespace}/${yoastWizardConfig.endpoint_retrieve}`,
			method: 'GET',
			async: false,
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', yoastWizardConfig.nonce );
			},
		} ).done( function ( response ) {
			config = response;
		} );

		return(
			<div>
				<OnboardingWizard {...config}/>
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('wizard'));