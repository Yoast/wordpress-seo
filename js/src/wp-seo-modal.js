/* global yoastModalConfig */

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { injectIntl, intlShape } from "react-intl";

import YoastModal from "yoast-components/composites/Plugin/Shared/components/YoastModal";
import IntlProvider from "./components/IntlProvider";

// Replace this with specific modal messages.
let localizedData = { intl: {} };
if ( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

class AddKeywordModal extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			modalIsOpen: false,
		};

		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );

		this.appElement = document.querySelector( yoastModalConfig.hide );
	}

	openModal() {
		this.setState( {
			modalIsOpen: true,
		} );
	}

	closeModal() {
		this.setState( {
			modalIsOpen: false,
		} );
	}

	/**
	 * Returns the rendered html.
	 *
	 * @returns {ReactElement} The rendered html.
	 */
	render() {
		return (
			<React.Fragment>
				<button type="button" onClick={ this.openModal }>{ yoastModalConfig.labels.open }</button>
				<YoastModal
					isOpen={ this.state.modalIsOpen }
					onClose={ this.closeModal }
					modalAriaLabel={ yoastModalConfig.labels.modal }
					appElement={ this.appElement }
				>
					<h1>Modal heading</h1>
					<form>
						<button type="button">tabbing</button>
						<button type="button">is constrained</button>
						<button type="button">within</button>
						<button type="button">the modal</button>
					</form>
					<button type="button" onClick={ this.closeModal }>{ yoastModalConfig.labels.close }</button>
				</YoastModal>
			</React.Fragment>
		);
	}
}

AddKeywordModal.propTypes = {
	className: PropTypes.string,
	intl: intlShape.isRequired,
};

const AddKeywordModalIntl = injectIntl( AddKeywordModal );

const element = document.querySelector( yoastModalConfig.hook );

if ( element ) {
	ReactDOM.render(
		<IntlProvider messages={ localizedData.intl }>
			<AddKeywordModalIntl />
		</IntlProvider>,
		element
	);
}
