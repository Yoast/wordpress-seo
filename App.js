import React from "react";
import { IntlProvider } from "react-intl";
import styled, { ThemeProvider } from "styled-components";
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
import UIControlsWrapper from "./app/UIControlsWrapper";
import KeywordExample from "./app/KeywordExample";
import ButtonsWrapper from "./app/ButtonsWrapper";
import SvgIconsWrapper from "./app/SvgIconsWrapper";

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
		id: "ui-controls",
		name: "UI Controls",
		component: <UIControlsWrapper />,
	},
	{
		id: "keyword-example",
		name: "Keyword",
		component: <KeywordExample />,
	},
	{
		id: "sidebar-collapsible",
		name: "Collapsibles",
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
	{
		id: "svg-icons",
		name: "SVG Icons",
		component: <SvgIconsWrapper />,
	},
];

const LanguageDirectionContainer = styled.div`
	text-align: center;
`;

class App extends React.Component {
	constructor() {
		super();

		injectTapEventPlugin();

		this.state = {
			activeComponent: "snippet-preview",
			isRtl: false,
		};

		this.changeLanguageDirection = this.changeLanguageDirection.bind( this );
	}

	getContent() {
		const activeComponent = this.state.activeComponent;
		for( var i = 0; i < components.length; i++ ) {
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
					to change position press <strong>Ctrl + Q</strong>
				</p>
			</nav>
		);
	}


	/**
	 * Renders a switch language directionality button.
	 *
	 * @returns {ReactElement} The rendered button.
	 */
	renderLanguageDirectionButton() {
		return (
			<button type="button" onClick={ this.changeLanguageDirection }>
				Change language direction
			</button>
		);
	}

	/**
	 * Changes the language direction state.
	 *
	 * @returns {void}
	 */
	changeLanguageDirection() {
		this.setState( {
			isRtl: ! this.state.isRtl,
		} );


	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.isRtl !== this.state.isRtl ) {
			document.documentElement.setAttribute( "dir", this.state.isRtl ? "rtl" : "ltr" );
		}
	}

	render() {
		return (
			<IntlProvider locale="en">
				<ThemeProvider theme={ { isRtl: this.state.isRtl } }>
					<div>
						{ this.getMenu() }
						<LanguageDirectionContainer>
							{ this.renderLanguageDirectionButton() }
						</LanguageDirectionContainer>
						{ this.getContent() }
					</div>
				</ThemeProvider>
			</IntlProvider>
		);
	}
}

export default App;
