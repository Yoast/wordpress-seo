import React from "react";
import { IntlProvider } from "react-intl";
// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";

import ContentAnalysis from "./app/ContentAnalysisWrapper";
import Wizard from "./app/WizardWrapper";
import DashboardWidget from "./app/DashboardWidgetWrapper";
import Loader from "./composites/basic/Loader";
import HelpCenterWrapper from "./app/HelpCenterWrapper";
import SidebarCollapsibleWrapper from "./app/SidebarCollapsibleWrapper";
import KeywordSuggestionsWrapper from "./app/KeywordSuggestionWrapper";
import SnippetEditor from "./app/SnippetEditorExample";
import Checkbox from "./composites/Plugin/Shared/components/Checkbox";
import KeywordExample from "./app/KeywordExample";
import ButtonsWrapper from "./app/ButtonsWrapper";

const components = [
	{
		id: "snippet-preview",
		name: "Snippet preview",
		component: <SnippetEditor />,
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
		name: "Content Analysis",
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
	{
		id: "checkbox",
		name: "Checkbox",
		component: <Checkbox
			id="example-checkbox"
			label={ [
				"This is a label that also accepts arrays, so you can pass links such as ",
				<a
					key="1"
					href="https://yoa.st/metabox-help-cornerstone?utm_content=7.0.3"
					target="_blank"
					rel="noopener noreferrer"
				>cornerstone content</a>,
				", for example.",
			] }
			onChange={ event => console.log( event ) }
		/>,
	},
	{
		id: "keyword-example",
		name: "Keyword",
		component: <KeywordExample />,
	},
	{
		id: "sidebar-collapsible",
		name: "Sidebar Collapsible",
		component: <SidebarCollapsibleWrapper />,
	},
	{
		id: "keyword-suggestions",
		name: "Keyword suggestions",
		component: <KeywordSuggestionsWrapper />,
	},
	{
		id: "buttons",
		name: "Buttons",
		component: <ButtonsWrapper />,
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
