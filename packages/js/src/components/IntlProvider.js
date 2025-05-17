import { Component } from "@wordpress/element";
import PropTypes from "prop-types";
import { IntlProvider as IntlProviderOriginal } from "react-intl";

/**
 * The component that will be wrapped by the Higher Order component.
 *
 * This component will render an IntlProvider when the locale-data promise is resolved.
 */
class IntlProvider extends Component {
	/**
	 * Renders the provider component.
	 *
	 * @returns {IntlProviderOriginal|string} String if Intl is missing, IntlProviderOriginal if not.
	 */
	render() {
		if ( typeof window.Intl === "undefined" ) {
			return (
				<div className="notice notice-error">
					<p>
						Yoast SEO detected that you are using a browser that does not support
						all the features we require. Please try using a different browser.
					</p>
				</div>
			);
		}

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
