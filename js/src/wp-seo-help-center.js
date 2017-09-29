/* global wpseoHelpCenter */

import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider, injectIntl, intlShape, addLocaleData } from "react-intl";

addLocaleData( wpseoHelpCenter.translations );

class IntlTest extends React.Component {
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
		locale="default"
		messages={ wpseoHelpCenter.translations }>
    	<Test />
	</IntlProvider>,
    document.getElementById( "yoast-help-center" ),
);
