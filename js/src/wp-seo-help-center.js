/* global wpseoHelpCenter wpseoHelpCenterData */

import React from "react";
import ReactDOM from "react-dom";
import get from "lodash/get";
import YoastTabs from "yoast-components/composites/Plugin/Shared/components/YoastTabs";
import VideoTutorial from "yoast-components/composites/HelpCenter/views/VideoTutorial";
import AlgoliaSearcher from "yoast-components/composites/AlgoliaSearch/AlgoliaSearcher";
import { IntlProvider, injectIntl, intlShape, addLocaleData } from "react-intl";

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
		return (
			<div classID="yoast-help-center">
				<YoastTabs
					items={ [ {
						id: "video-tutorial",
						label: formatMessage( { id: "videoTutorial" } ),
						content: <VideoTutorial
							src={ this.state.videoUrl }
							title="Learn this"
							items={ items } />,
					}, {
						id: "knowledge-base",
						label: formatMessage( { id: "knowledgeBase" } ),
						content: <AlgoliaSearcher />,
					}, {
						id: "support",
						label: formatMessage( { id: "getSupport" } ),
						content: <h1>Get support</h1>,
					} ] }/>
            </div>
		);
	}
}

HelpCenter.propTypes = {
	intl: intlShape.isRequired,
};

const HelpCenterIntl = injectIntl( HelpCenter );

ReactDOM.render(
	<IntlProvider
		locale={ wpseoHelpCenterData.translations.locale }
		messages={ wpseoHelpCenterData.translations }>
		<HelpCenterIntl
			initialTab={ wpseoHelpCenterData.initialTab }
			tabs={ wpseoHelpCenterData.tabs } />
	</IntlProvider>,
    document.getElementById( wpseoHelpCenterData.mountId )
);
