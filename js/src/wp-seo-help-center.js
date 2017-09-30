/* global wpseoHelpCenter */

import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import YoastTabs from "yoast-components/composites/Plugin/Shared/components/YoastTabs";
import VideoTutorial from "yoast-components/composites/HelpCenter/views/VideoTutorial";
import AlgoliaSearcher from "yoast-components/composites/AlgoliaSearch/AlgoliaSearcher";
import { IntlProvider, injectIntl, intlShape, addLocaleData } from "react-intl";

addLocaleData( wpseoHelpCenter.translations );

const HelpCenterContainer = styled.div`
`;

class IntlTest extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			videoUrl: null,
		};

		window.addEventListener( "hashchange", this.tabChanged.bind( this ) );
	}

	tabChanged() {
		const tabId = location.hash.replace( "#top#", "" );
		const videoUrl = this.props.tabData[ tabId ].video_url;
		this.setState( { videoUrl } );
	}

	render() {
        const items= [
            {
                title: "Need some help?",
                description: "Go Premium and our experts will be there for you to answer any questions you might have about the setup and use of the plugin.",
                link: "#1",
                linkText: "Get Yoast SEO Premium now »",
            },
            {
                title: "Want to be a Yoast SEO Expert?",
                description: "Follow our Yoast SEO for WordPress training and become a certified Yoast SEO Expert!",
                link: "#2",
                linkText: "Enroll in the Yoast SEO for WordPress training »",
            },
        ];
		const translation = this.props.intl.formatMessage( {
			id: "translationId",
			defaultMessage: "{ Not translated }",
		} );
		return (
		    <div classID="yoast-help-center">
                <YoastTabs
                    items={ [ {
                        id: "video-tutorial",
                        label: "Video tutorial",
                        content: <VideoTutorial
                            src={ this.state.videoUrl }
                            title="Learn this"
                            items={ items }/>
                    }, {
                        id: "knowledge-base",
                        label: "Knowledge base",
                        content: <AlgoliaSearcher />,
                    }, {
                        id: "support",
                        label: "Support",
                        content: <h1>Get support</h1>,
                    }, ] }/>
            </div>
        );
	}
}

IntlTest.propTypes = {
	intl: intlShape.isRequired,
};

const Test = injectIntl( IntlTest );

ReactDOM.render(
	<IntlProvider
		locale={ wpseoHelpCenter.translations.locale }
		messages={ wpseoHelpCenter.translations }>
    	<Test tabData={ window.wpseoOptionTabData } />
	</IntlProvider>,
    document.getElementById( "yoast-help-center" )
);
