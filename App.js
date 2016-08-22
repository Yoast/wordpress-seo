import React from "react";
import ReactDOM from "react-dom";

import Wizard from "./composites/onboarding-wizard/wizard";
import Config from "./composites/onboarding-wizard/config/config";
import SearchResultsEditor from "./composites/SearchResultEditor/SearchResultEditor";

function cloneDeep( object ) {
	return JSON.parse( JSON.stringify( object ) );
}

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			activeComponent: "wizard"
		};
	}

	getContent() {
		var content;

		switch ( this.state.activeComponent ) {
			case "search-results-editor":
				content = <SearchResultsEditor />;
				break;

			case "wizard":
			default:
				let config = cloneDeep( Config );
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
			<nav style={{margin: '0 0 2rem 0'}}>
				<button type="button" onClick={this.navigate.bind( this, "wizard" )}>Wizard</button>
				<button type="button" onClick={this.navigate.bind( this, "search-results-editor" )}>Search results editor</button>
			</nav>
		);
	}

	render() {
		return (
			<div style={{ width: '80%', margin: '0 auto' }}>
				{this.getMenu()}
				{this.getContent()}
			</div>
		);
	}
}

ReactDOM.render( <App />, document.getElementById( 'container' ) );
