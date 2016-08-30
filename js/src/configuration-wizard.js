import React from "react";
import ReactDOM from "react-dom";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";
import {OnboardingWizard} from "yoast-components";

injectTapEventPlugin();

class App extends React.Component {

	getEndpoint() {
		return {
			url : `${yoastWizardConfig.root}${yoastWizardConfig.namespace}/${yoastWizardConfig.endpoint_retrieve}`,
			headers : {
				'X-WP-Nonce' : yoastWizardConfig.nonce,
			}
		};
	}

	getConfig() {
		let config = {};
		let endpoint = this.getEndpoint();

		jQuery.ajax( {
			url: endpoint.url,
			method: 'GET',
			async: false,
			beforeSend: function ( xhr ) {
				jQuery.each( endpoint.headers, xhr.setRequestHeader );
			},
		} ).done( function ( response ) {
			config = response;
		} );

		config.endpoint = endpoint;

		return config;
	}

	render(){
		let config = this.getConfig();

		return(
			<div>
				<OnboardingWizard {...config}/>
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('wizard'));
