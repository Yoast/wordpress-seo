import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./composites/OnboardingWizard/OnboardingWizard";
import Config from "./composites/OnboardingWizard/config/production-config";
import SearchResultsEditor from "./composites/SearchResultEditor/SearchResultEditor";
import SnippetPreview from "./composites/SnippetPreview/components/SnippetPreview";
import apiConfig from "./composites/OnboardingWizard/config/api-config";
import Loader from "./composites/basic/Loader";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";

function cloneDeep( object ) {
	return JSON.parse( JSON.stringify( object ) );
}

class App extends React.Component {

	constructor() {
		super();

		injectTapEventPlugin();

		this.state = {
			activeComponent: "wizard",
		};
	}

	getContent() {
		var content;

		switch ( this.state.activeComponent ) {
			case "search-results-editor":
				content = <SearchResultsEditor />;
				break;

			case "snippet-preview":
				content = <SnippetPreview />;
				break;

			case "loader":
				content = <Loader />;
				break;

			case "wizard":
			default:
				let config = cloneDeep( Config );

				// @todo: Add customComponents manually, because cloneDeep is clearing the value of it. Should be solved.
				config.customComponents = Config.customComponents;
				config.endpoint = apiConfig;

				content = <Wizard {...config} />;
				break;
		}

		return content;
	}

	navigate( activeComponent, event ) {
		this.setState({
			activeComponent: activeComponent
		});
	}

	getMenu() {
		return (
			<nav style={ {margin: "0 0 2rem 0", textAlign: "center" } }>
				<button type="button" onClick={this.navigate.bind( this, "wizard" )}>Wizard</button>
				<button type="button" onClick={this.navigate.bind( this, "search-results-editor" )}>Search results editor</button>
				<button type="button" onClick={this.navigate.bind( this, "loader" )}>Loader</button>
				<button type="button" onClick={this.navigate.bind( this, "snippet-preview" )}>Snippet preview</button>
			</nav>
		);
	}

	render() {
		return (
			<div>
				{this.getMenu()}
				{this.getContent()}
			</div>
		);
	}
}

ReactDOM.render( <App />, document.getElementById( 'container' ) );
