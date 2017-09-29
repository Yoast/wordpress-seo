/* global wpseoHelpCenter */

import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider, injectIntl, intlShape, addLocaleData } from "react-intl";

addLocaleData( wpseoHelpCenter.translations );

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
		this.setState( { videoUrl: this.props.tabData[ tabId ].video_url } );
	}

	render() {
		const translation = this.props.intl.formatMessage( {
			id: "translationId",
			defaultMessage: "{ Not translated }",
		} );
		return <span>{ translation }</span>
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
