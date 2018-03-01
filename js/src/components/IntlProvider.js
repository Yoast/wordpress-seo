import React from "react";
import PropTypes from "prop-types";
import { IntlProvider as IntlProviderOriginal } from "react-intl";

/**
 * The component that will be wrapped by the Higher Order component.
 *
 * This component will render an IntlProvider when the locale-data promise is resolved.
 */
class IntlProvider extends React.Component {
	render() {
		return (
			<IntlProviderOriginal
				locale="en"
				messages={ this.props.messages }
				>
				{ this.props.children }
			</IntlProviderOriginal>
		);
	}
}

IntlProvider.propTypes = {
	messages: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
};

export default IntlProvider;
