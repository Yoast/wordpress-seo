/* global wpseoHelpCenterData jQuery */

/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import get from "lodash/get";
import { __ } from "@wordpress/i18n";
import { setYoastComponentsL10n } from "./helpers/i18n";

/* Yoast dependencies */
import { VideoTutorial, HelpCenter as HelpCenterYC } from "yoast-components";
import { YoastButton } from "@yoast/components";
import AlgoliaSearcher from "@yoast/algolia-search-box";
import { colors } from "@yoast/style-guide";

/**
 * Executes an action with an argument.
 *
 * @param {Object} props The component's props.
 *
 * @returns {React.Element} The rendered ContactSupport component.
 */
const ContactSupport = ( { onClick, paragraphs } ) => {
	return (
		<div className="contact-premium-support">
			{ paragraphs.map( ( paragraph, index ) => {
				const { image, content } = paragraph;
				return (
					<p key={ index } className="contact-premium-support__content">
						{ image ? <img src={ image.src } width={ image.width } height={ image.height } alt={ image.alt } /> : null }
						{ content }
					</p>
				);
			} ) }
			<YoastButton
				className="contact-premium-support__button"
				onClick={ onClick }
			>
				{ __( "Get support", "wordpress-seo" ) }
			</YoastButton>
		</div>
	);
};

ContactSupport.propTypes = {
	paragraphs: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
};

/**
 * The help center component.
 */
class HelpCenter extends React.Component {
	/**
	 * The component constructor.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );

		const initialTab = this.getTabIdFromUrlHash() || props.initialTab;
		this.state = {
			videoUrl: this.getVideoUrl( initialTab ),
			usedQueries: {},
		};

		window.addEventListener( "hashchange", this.tabChanged.bind( this ) );

		this.onContactSupportClick = this.onContactSupportClick.bind( this );
		this.updateUsedQueries = this.updateUsedQueries.bind( this );
	}

	/**
	 * Callback called when the user switches tabs.
	 *
	 * @returns {void}
	 */
	tabChanged() {
		/*
		 * Account for other URL fragment identifiers. For example, the "skip links"
		 * `#wpbody-content` and `#wp-toolbar` used in WordPress. When the hash
		 * changes and doesn't contain `#top#`, that means users didn't click on
		 * one of the Yoast tabs.
		 */
		if ( location.hash.indexOf( "#top#" ) === -1 ) {
			return;
		}

		const tabId = this.getTabIdFromUrlHash();
		const videoUrl = this.getVideoUrl( tabId );
		this.setState( { videoUrl } );
	}

	/**
	 * Get the video URL based on the given tab id.
	 *
	 * @param {string} tabId The tab id.
	 *
	 * @returns {string} The video URL.
	 */
	getVideoUrl( tabId ) {
		return get( this.props.adminTabsData, `${tabId}.videoUrl` );
	}

	/**
	 * Parses the tab id from the URL hash.
	 *
	 * @returns {string} The tab id.
	 */
	getTabIdFromUrlHash() {
		return location.hash.replace( "#top#", "" );
	}

	/**
	 * Stores the search queries done by the AlgoliaSearcher in state.
	 *
	 * @param {object} usedQueries A key value object containing search queries.
	 *
	 * @returns {void}
	 */
	updateUsedQueries( usedQueries ) {
		this.setState( prevState => ( {
			...prevState.usedQueries,
			...usedQueries,
		} ) );
	}

	/**
	 * Create a formatted array of tabs for the HelpCenter component.
	 *
	 * @returns {Array} Help center tab data.
	 */
	getTabs() {
		const tabs = [];

		// Video tab
		if ( this.state.videoUrl ) {
			tabs.push( {
				id: "video-tutorial",
				label: __( "Video tutorial", "wordpress-seo" ),
				content: <VideoTutorial
					src={ this.state.videoUrl }
					title=""
					paragraphs={ this.props.videoTutorialParagraphs }
				/>,
			} );
		}

		// Knowledge base
		tabs.push( {
			id: "knowledge-base",
			label: __( "Knowledge base", "wordpress-seo" ),
			content: <AlgoliaSearcher
				onQueryChange={ this.updateUsedQueries }
			/>,
		} );

		// Additional tabs
		Array.prototype.push.apply( tabs, this.getAdditionalTabs() );

		return tabs;
	}

	/**
	 * Calls the contact support callback props with the used queries.
	 *
	 * @returns {void}
	 */
	onContactSupportClick() {
		this.props.onPremiumSupport( this.state.usedQueries );
	}

	/**
	 * Create a formatted array of tabs for all additional tabs passed via props.additionalHelpCenterTabs.
	 *
	 * @returns {Array} {Array} Help center tab data.
	 */
	getAdditionalTabs() {
		const additionalTabs = [];

		if ( ! this.props.additionalHelpCenterTabs ) {
			return additionalTabs;
		}

		this.props.additionalHelpCenterTabs.map( tab => {
			let content;
			if ( this.props.shouldDisplayContactForm === "1" && tab.identifier === "contact-support" ) {
				content = <ContactSupport
					paragraphs={ this.props.contactFormParagraphs }
					onClick={ this.onContactSupportClick }
				/>;
			}
			additionalTabs.push( {
				id: tab.identifier,
				label: tab.label,
				content: content ? content : <div dangerouslySetInnerHTML={ { __html: tab.content } } />,
			} );
		} );

		return additionalTabs;
	}

	/**
	 * Renders the HelpCenter.
	 *
	 * @returns {ReactElement} The HelpCenter component.
	 */
	render() {
		return (
			<HelpCenterYC
				buttonBackgroundColor={ colors.$color_white }
				buttonTextColor={ colors.$color_pink_dark }
				buttonIconColor={ colors.$color_pink_dark }
				buttonWithTextShadow={ false }
				onHelpCenterToggle={ this.props.onHelpCenterToggle }
				onTabSelect={ this.props.onTabSelect }
				onTabsMounted={ this.props.onTabsMounted }
				items={ this.getTabs() }
			/>
		);
	}
}

HelpCenter.propTypes = {
	onHelpCenterToggle: PropTypes.func.isRequired,
	onTabSelect: PropTypes.func.isRequired,
	onTabsMounted: PropTypes.func.isRequired,
	onPremiumSupport: PropTypes.func.isRequired,
	adminTabsData: PropTypes.object.isRequired,
	additionalHelpCenterTabs: PropTypes.array.isRequired,
	videoTutorialParagraphs: PropTypes.array.isRequired,
	shouldDisplayContactForm: PropTypes.string.isRequired,
	contactFormParagraphs: PropTypes.array.isRequired,
	initialTab: PropTypes.string.isRequired,
};

/**
 * Premium support callback.
 *
 * @param {object} usedQueries AlgoliaSearcher queries.
 *
 * @returns {void}
 */
function onPremiumSupport( usedQueries ) {
	jQuery( window ).trigger( "YoastSEO:ContactSupport", { usedQueries } );
}

/**
 * Toggle the sidebar if it's visible.
 *
 * @param {bool} expanded Help center state.
 *
 * @returns {void}
 */
function toggleSidebar( expanded ) {
	jQuery( ".wpseo_content_wrapper" ).toggleClass( "yoast-help-center-open", expanded );
}

/**
 * Triggers a custom DOM event when the react tabs gets mounted.
 *
 * By default only the current active tab panel content will be rendered. The
 * other tab panels will be empty. If the react-tabs prop `forceRenderTabPanel`
 * is set to true the content of all the panels will be always rendered.
 *
 * @returns {void}
 */
function handleTabsMounted() {
	jQuery( window ).trigger( "Yoast:YoastTabsMounted" );
}

/**
 * Triggers a custom DOM event when a react tabs gets selected.
 *
 * @returns {void}
 */
function handleTabSelect() {
	jQuery( window ).trigger( "Yoast:YoastTabsSelected" );
}

if ( window.wpseoHelpCenterData ) {
	setYoastComponentsL10n();

	ReactDOM.render(
		<HelpCenter
			onHelpCenterToggle={ toggleSidebar }
			onTabSelect={ handleTabSelect }
			onTabsMounted={ handleTabsMounted }
			onPremiumSupport={ onPremiumSupport }
			initialTab={ wpseoHelpCenterData.initialTab }
			adminTabsData={ wpseoHelpCenterData.tabs }
			additionalHelpCenterTabs={ wpseoHelpCenterData.extraTabs }
			videoTutorialParagraphs={ wpseoHelpCenterData.videoDescriptions }
			shouldDisplayContactForm={ wpseoHelpCenterData.shouldDisplayContactForm }
			contactFormParagraphs={ wpseoHelpCenterData.contactSupportParagraphs }
		/>,
		document.getElementById( wpseoHelpCenterData.mountId )
	);
}
