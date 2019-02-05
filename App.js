import React from "react";
import { IntlProvider } from "react-intl";
import styled, { ThemeProvider } from "styled-components";

import ButtonsWrapper from "./app/ButtonsWrapper";
import ComponentsExample from "./app/ComponentsExample";
import ContentAnalysis from "./app/ContentAnalysisWrapper";
import DashboardWidget from "./app/DashboardWidgetWrapper";
import HelpCenterWrapper from "./app/HelpCenterWrapper";
import KeywordExample from "./app/KeywordExample";
import KeywordSuggestionsWrapper from "./app/KeywordSuggestionWrapper";
import SidebarCollapsibleWrapper from "./app/SidebarCollapsibleWrapper";
import SnippetEditor from "./app/SnippetEditorExample";
import SvgIconsWrapper from "./app/SvgIconsWrapper";
import UIControlsWrapper from "./app/UIControlsWrapper";
import Wizard from "./app/WizardWrapper";
import Loader from "./composites/basic/Loader";
import FacebookPreview from "./composites/Plugin/SocialPreviews/Facebook/components/FacebookPreview";

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
	{
		id: "components-example",
		name: "Components",
		component: <ComponentsExample />,
	},
	{
		id: "facebookpreview-example-landscape",
		name: "FacebookPreview Landscape",
		component: <FacebookPreview siteName="SiteName.com" src="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png" />,
	},
	{
		id: "facebookpreview-example-portrait",
		name: "FacebookPreview Portrait",
		component: <FacebookPreview siteName="SiteName.com" src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" />,
	},
	{
		id: "facebookpreview-example-square",
		name: "FacebookPreview Square",
		component: <FacebookPreview siteName="SiteName.com" src="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png" />,
	},
	{
		id: "facebookpreview-example-too-small",
		name: "FacebookPreview too small image",
		component: <FacebookPreview siteName="SiteName.com" src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" />,
	},
	{
		id: "facebookpreview-example-error",
		name: "FacebookPreview faulty image",
		component: <FacebookPreview siteName="SiteName.com" src="thisisnoimage" />,
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
			activeComponent: "snippet-preview",
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
