import React from "react";
import { IntlProvider } from "react-intl";

import SearchResultsEditor from "./composites/SearchResultEditor/SearchResultEditor";
import SnippetPreviewExample from "./composites/Plugin/SnippetPreview/components/SnippetPreviewExample";
import ContentAnalysis from "./app/ContentAnalysisWrapper";
import Wizard from "./app/WizardWrapper";
import DashboardWidget from "./app/DashboardWidgetWrapper";
import Loader from "./composites/basic/Loader";
import HelpCenterWrapper from "./app/HelpCenterWrapper";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";

const components = [
	{
		id: "search-results-editor",
		name: "Search results editor",
		component: <SearchResultsEditor />,
	},
	{
		id: "snippet-preview",
		name: "Snippet preview",
		component: <SnippetPreviewExample />,
	},
	{
		id: "wizard",
		name: "Wizard",
		component: <Wizard />,
	},
	{
		id: "loader",
		name: "Loader",
		component: <Loader />,
	},
	{
		id: "content-analysis",
		name: "Content analysis",
		component: <ContentAnalysis />,
	},
	{
		id: "dashboard-widget",
		name: "Dashboard Widget",
		component: <DashboardWidget />,
	},
	{
		id: "help-center",
		name: "Help center",
		component: <HelpCenterWrapper />,
	},
];

class App extends React.Component {

	constructor() {
		super();

		injectTapEventPlugin();

		this.state = {
			activeComponent: "snippet-preview",
		};
	}

	getContent() {
		const activeComponent = this.state.activeComponent;
		for( var i = 0; i < components.length; i++ )  {
			if( activeComponent === components[ i ].id ) {
				return components[ i ].component;
			}
		}
	}

	navigate( activeComponent ) {
		this.setState( {
			activeComponent: activeComponent,
		} );
	}

	renderButton( id, title ) {
		const isActive = this.state.activeComponent === id;
		const style = {};
		if( isActive ) {
			style.backgroundColor = "#006671";
			style.color = "#FFF";
			style.borderRadius = "5px";
			style.border = "1px solid white";
			style.outline = "none";
		}
		return (
			<button style={ style } key={ id } type="button" onClick={ this.navigate.bind( this, id ) }>
				{ title }
			</button>
		);
	}

	getMenu() {
		return (
			<nav style={ { textAlign: "center" } }>
				{
					components.map( config => {
						return this.renderButton( config.id, config.name );
					} )
				}
				<p style={ { fontSize: "0.8em", margin: "5px 0" } }>
					For redux devtools press <strong>Ctrl + H</strong>,
					to change position press <strong>Ctrl + Q</strong>.
				</p>
			</nav>
		);
	}

	render() {
		return (
			<IntlProvider locale="en">
				<div>
					{ this.getMenu() }
					{ this.getContent() }
				</div>
			</IntlProvider>
		);
	}
}

export default App;
