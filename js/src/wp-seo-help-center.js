/* global wpseoHelpCenterData jQuery */

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import get from "lodash/get";
import { IntlProvider, injectIntl, intlShape, addLocaleData } from "react-intl";

import VideoTutorial from "yoast-components/composites/HelpCenter/views/VideoTutorial";
import AlgoliaSearcher from "yoast-components/composites/AlgoliaSearch/AlgoliaSearcher";
import HelpCenterYC from "yoast-components/composites/Plugin/HelpCenter/HelpCenter";
import colors from "yoast-components/style-guide/colors.json";
import { YoastButton } from "yoast-components/composites/Plugin/Shared/components/YoastButton";

/**
 * Executes an action with an argument.
 */
class ContactSupport extends React.Component {
	componentDidMount() {
		this.execute();
	}

	/**
	 * Execute the contact support callback.
	 *
	 * @returns {void}
	 */
	execute() {
		if( this.props.do ) {
			this.props.do(
				this.props.with
			);
		}
	}

	/**
	 * Render the component.
	 *
	 * @returns {ReactElement} ContactSupport component.
	 */
	render() {
		return (
			<div className="contact-premium-support-container">
				<YoastButton
					onClick={ this.execute.bind( this ) }>
					{ this.props.buttonText }
				</YoastButton>
			</div>
		);
	}
}

ContactSupport.propTypes = {
	buttonText: PropTypes.string,
	"do": PropTypes.func,
	"with": PropTypes.any,
};

/**
 * The help center component.
 */
class HelpCenter extends React.Component {
	constructor( props ) {
		super( props );

		const initialTab = this.getTabIdFromUrlHash() || props.initialTab;
		this.state = {
			videoUrl: this.getVideoUrl( initialTab ),
			usedQueries: {},
		};

		window.addEventListener( "hashchange", this.tabChanged.bind( this ) );
	}

	/**
	 * Callback called when the user switches tabs.
	 *
	 * @returns {void}
	 */
	tabChanged() {
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
		const queries = Object.assign(
			{},
			this.state.usedQueries,
			usedQueries
		);
		this.setState( { usedQueries: queries } );
	}

	/**
	 * Create a formatted array of tabs for the HelpCenter component.
	 *
	 * @returns {Array} Help center tab data.
	 */
	getTabs() {
		const formatMessage = this.props.intl.formatMessage;
		const tabs = [];

		// Video tab
		if( this.state.videoUrl ) {
			tabs.push( {
				id: "video-tutorial",
				label: formatMessage( { id: "videoTutorial" } ),
				content: <VideoTutorial
					src={ this.state.videoUrl }
					title=""
					paragraphs={ this.props.videoTutorialParagraphs } />,
			} );
		}

		// Knowledge base
		tabs.push( {
			id: "knowledge-base",
			label: formatMessage( { id: "knowledgeBase" } ),
			content: <AlgoliaSearcher
				onQueryChange={ this.updateUsedQueries.bind( this ) } />,
		} );

		// Additional tabs
		Array.prototype.push.apply( tabs, this.getAdditionalTabs() );

		return tabs;
	}

	/**
	 * Create a formatted array of tabs for all additional tabs passed via props.additionalHelpCenterTabs.
	 *
	 * @returns {Array} {Array} Help center tab data.
	 */
	getAdditionalTabs() {
		const additionalTabs = [];

		if( ! this.props.additionalHelpCenterTabs ) {
			return additionalTabs;
		}

		this.props.additionalHelpCenterTabs.map( tab => {
			let content;
			if( this.props.shouldDisplayContactForm === "1" ) {
				const supportButton = this.props.intl.formatMessage( { id: "contactSupport.button" } );
				content = <ContactSupport
					buttonText={ supportButton }
					do={ this.props.onPremiumSupport }
					with={ this.state.usedQueries } />;
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
				items={ this.getTabs() }
			/>
		);
	}
}

HelpCenter.propTypes = {
	onHelpCenterToggle: PropTypes.func,
	onPremiumSupport: PropTypes.func,
	adminTabsData: PropTypes.object.isRequired,
	additionalHelpCenterTabs: PropTypes.array,
	videoTutorialParagraphs: PropTypes.object,
	shouldDisplayContactForm: PropTypes.string,
	initialTab: PropTypes.string,
	intl: intlShape.isRequired,
};

const HelpCenterIntl = injectIntl( HelpCenter );

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

if ( window.wpseoHelpCenterData ) {
	// Add react-intl translations
	addLocaleData( wpseoHelpCenterData.translations );

	ReactDOM.render(
		<IntlProvider
			locale={wpseoHelpCenterData.translations.locale}
			messages={wpseoHelpCenterData.translations}>
			<HelpCenterIntl
				onHelpCenterToggle={toggleSidebar}
				onPremiumSupport={onPremiumSupport}
				initialTab={wpseoHelpCenterData.initialTab}
				adminTabsData={wpseoHelpCenterData.tabs}
				additionalHelpCenterTabs={wpseoHelpCenterData.extraTabs}
				videoTutorialParagraphs={wpseoHelpCenterData.videoDescriptions}
				shouldDisplayContactForm={wpseoHelpCenterData.shouldDisplayContactForm}
			/>
		</IntlProvider>,
		document.getElementById( wpseoHelpCenterData.mountId )
	);
}
