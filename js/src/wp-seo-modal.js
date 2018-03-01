/* global yoastModalConfig wpseoPostScraperL10n wpseoTermScraperL10n */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { injectIntl, intlShape } from "react-intl";

import YoastModal from "yoast-components/composites/Plugin/Shared/components/YoastModal";
import modals from "./components/modals";
import IntlProvider from "./components/IntlProvider";

// Replace this with specific modal messages.
let localizedData = { intl: {} };
if ( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

class Modal extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			modalIsOpen: false,
		};

		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );

		this.appElement = document.querySelector( this.props.hide );
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
		// See https://reactjs.org/docs/jsx-in-depth.html#choosing-the-type-at-runtime
		const ModalContent = modals[ this.props.content ];

		return (
			<React.Fragment>
				<button type="button" onClick={ this.openModal }>{ this.props.labels.open }</button>
				<YoastModal
					isOpen={ this.state.modalIsOpen }
					onClose={ this.closeModal }
					modalAriaLabel={ this.props.labels.modal }
					appElement={ this.appElement }
				>
					<h1>Modal: { this.props.labels.modal }</h1>
					<ModalContent />
					<button type="button" onClick={ this.closeModal }>{ this.props.labels.close }</button>
				</YoastModal>
			</React.Fragment>
		);
	}
}

Modal.propTypes = {
	className: PropTypes.string,
	intl: intlShape.isRequired,
	hide: PropTypes.string.isRequired,
	labels: PropTypes.object,
	content: PropTypes.string.isRequired,
};

const ModalIntl = injectIntl( Modal );

yoastModalConfig.forEach(
	( config ) => {
		if ( ! config.hook ) {
			return;
		}

		const element = document.querySelector( config.hook );

		if ( element ) {
			ReactDOM.render(
				<IntlProvider messages={ localizedData.intl }>
					<ModalIntl
						hook={ config.hook }
						hide={ config.hide }
						labels={ config.labels }
						content={ config.content }
					/>
				</IntlProvider>,
				element
			);
		}
	}
);
