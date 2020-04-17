import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { setLocaleData } from "@wordpress/i18n";

import ButtonsWrapper from "./ButtonsWrapper";
import ComponentsExample from "./ComponentsExample";
import ContentAnalysis from "./ContentAnalysisWrapper";
import DashboardWidget from "./DashboardWidgetWrapper";
import KeywordExample from "./KeywordExample";
import WordListWrapper from "./WordListWrapper";
import SidebarCollapsibleWrapper from "./SidebarCollapsibleWrapper";
import SnippetEditor from "./SnippetEditorExample";
import SvgIconsWrapper from "./SvgIconsWrapper";
import UIControlsWrapper from "./UIControlsWrapper";
import Wizard from "./WizardWrapper";
import { Loader } from "@yoast/components";
import FacebookPreviewExample from "./FacebookPreviewExample";
import TwitterPreviewExample from "./TwitterPreviewExample";
import LinkSuggestionsWrapper from "./LinkSuggestionsExample";
import WordOccurrencesWrapper from "./WordOccurrencesWrapper";
import MultiStepProgressWrapper from "./MultiStepProgressWrapper";
import SocialPreviewFormWrapper from "./SocialPreviewFormWrapper";
import ReactifiedComponentsWrapper from "./ReactifiedComponentsWrapper";
import SocialPreviewEditorWrapper from "./SocialPreviewEditorWrapper";


// Setup empty translations to prevent Jed error.
setLocaleData( { "": {} }, "yoast-components" );

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
		id: "wordlist",
		name: "WordList",
		component: <WordListWrapper />,
	},
	{
		id: "linkSuggestions",
		name: "LinkSuggestions",
		component: <LinkSuggestionsWrapper />,
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
	{
		id: "components-example",
		name: "Components",
		component: <ComponentsExample />,
	},
	{
		id: "facebookpreview-example",
		name: "FacebookPreview",
		component: <FacebookPreviewExample />,
	},
	{
		id: "twitterpreview-example",
		name: "TwitterPreview",
		component: <TwitterPreviewExample />,
	},
	{
		id: "wordoccurrences-example",
		name: "WordOccurrences",
		component: <WordOccurrencesWrapper />,
	},
	{
		id: "multi-step-progress",
		name: "Multi step progress",
		component: <MultiStepProgressWrapper />,
	},
	{
		id: "social-preview-data-form",
		name: "Social Preview data form",
		component: <SocialPreviewFormWrapper />,
	},
	{
		id: "social-preview",
		name: "Social Preview",
		component: <SocialPreviewEditorWrapper />,
	},
	{
		id: "reactified-components",
		name: "Reactified components",
		component: <ReactifiedComponentsWrapper />,
	},
];

const LanguageDirectionContainer = styled.div`
	text-align: center;
`;

/**
 *  Represents the React Example App.
 */
class App extends React.Component {
	/**
	 *  Constructs the App container.
	 */
	constructor() {
		super();

		this.state = {
			activeComponent: localStorage.getItem( "active-component" ) || "buttons",
			isRtl: false,
		};
		this.changeLanguageDirection = this.changeLanguageDirection.bind( this );
	}

	/**
	 * Get the active component.
	 *
	 * @returns {string} The active component.
	 */
	getContent() {
		const activeComponent = this.state.activeComponent;
		for ( var i = 0; i < components.length; i++ ) {
			if ( activeComponent === components[ i ].id ) {
				return <div key={ components[ i ].id }>{ components[ i ].component }</div>;
			}
		}
	}

	/**
	 * Sets the activeComponent in the state.
	 *
	 * @param {string} activeComponent The active component id.
	 *
	 * @returns {void}
	 */
	navigate( activeComponent ) {
		this.setState( {
			activeComponent: activeComponent,
		}, () => {
			localStorage.setItem( "active-component", activeComponent );
		} );
	}

	/**
	 * Renders the button for each component section.
	 *
	 * @param {string} id    The component id.
	 * @param {string} title The component name.
	 *
	 * @returns {ReactElement} The button.
	 */
	renderButton( id, title ) {
		const isActive = this.state.activeComponent === id;
		const style = {};
		if ( isActive ) {
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

	/**
	 * Renders the menu.
	 *
	 * @returns {ReactElement} The navigation menu.
	 */
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

	/**
	 * Sets the language direction based on what direction is in the current state after the component did update.
	 *
	 * @param {Object} prevProps The old props.
	 * @param {Object} prevState The old state.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		// Set and update the <html> element dir attribute based on the current language direction.
		if ( prevState.isRtl !== this.state.isRtl ) {
			document.documentElement.setAttribute( "dir", this.state.isRtl ? "rtl" : "ltr" );
		}
	}

	/**
	 * Renders the example app.
	 *
	 * @returns {ReactElement} The rendered App.
	 */
	render() {
		return (
			<ThemeProvider theme={ { isRtl: this.state.isRtl } }>
				<div>
					{ this.getMenu() }
					<LanguageDirectionContainer>
						{ this.renderLanguageDirectionButton() }
					</LanguageDirectionContainer>
					{ this.getContent() }
				</div>
			</ThemeProvider>
		);
	}
}

export default App;
