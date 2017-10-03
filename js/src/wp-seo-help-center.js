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

addLocaleData( wpseoHelpCenterData.translations );

class HelpCenter extends React.Component {
	constructor( props ) {
		super( props );

		const initialTab = this.getTabIdFromHash() || props.initialTab;
		this.state = {
			videoUrl: this.getVideoUrl( initialTab ),
		};

		window.addEventListener( "hashchange", this.tabChanged.bind( this ) );
	}

	tabChanged() {
		const tabId = this.getTabIdFromHash();
		const videoUrl = this.getVideoUrl( tabId );
		this.setState( { videoUrl } );
	}

	getVideoUrl( tabId ) {
		return get( this.props.tabs, `${tabId}.videoUrl` );
	}

	getTabIdFromHash() {
		return location.hash.replace( "#top#", "" );
	}

	render() {
		const formatMessage = this.props.intl.formatMessage;
		const items = wpseoHelpCenterData.videoDescriptions;

		const extraTabs = [];

		wpseoHelpCenterData.extraTabs.map( tab => {
			let content;
			if( tab.identifier === wpseoHelpCenterData.premiumSupportId ) {
				content = () => {

				};
			}
			extraTabs.push( {
				id: tab.identifier,
				label: tab.label,
				content: content || <div dangerouslySetInnerHTML={ { __html: tab.content } } />
			} );
		} );

		return (
			<div classID="yoast-help-center">
				<HelpCenterYC
					buttonBackgroundColor={ colors.$color_white }
					buttonTextColor={ colors.$color_pink_dark }
					buttonIconColor={ colors.$color_pink_dark }
					buttonWithTextShadow={ false }
					onHelpCenterToggle={ this.props.onHelpCenterToggle }
					items={ [ {
						id: "video-tutorial",
						label: formatMessage( { id: "videoTutorial" } ),
						content: <VideoTutorial
							src={ this.state.videoUrl }
							title="Learn this"
							paragraphs={ items } />,
					}, {
						id: "knowledge-base",
						label: formatMessage( { id: "knowledgeBase" } ),
						content: <AlgoliaSearcher />,
					}, ...extraTabs ] }/>
            </div>
		);
	}
}

HelpCenter.propTypes = {
	onHelpCenterToggle: PropTypes.func,
	onPremiumSupport: PropTypes.func,
	tabs: PropTypes.object.isRequired,
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
	jQuery( window ).trigger( "YoastSEO:ContactSupport", usedQueries );
}

/**
 *
 */
function onHelpCenterToggle( expanded ) {
	jQuery( ".wpseo_content_wrapper" ).toggleClass( "yoast-help-center-open", expanded );
}

ReactDOM.render(
	<IntlProvider
		locale={ wpseoHelpCenterData.translations.locale }
		messages={ wpseoHelpCenterData.translations }>
		<HelpCenterIntl
			onHelpCenterToggle={ onHelpCenterToggle }
			onPremiumSupport={ onPremiumSupport }
			initialTab={ wpseoHelpCenterData.initialTab }
			tabs={ wpseoHelpCenterData.tabs } />
	</IntlProvider>,
    document.getElementById( wpseoHelpCenterData.mountId )
);
