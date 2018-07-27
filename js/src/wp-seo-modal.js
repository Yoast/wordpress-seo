/* global yoastModalConfig */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { injectIntl, intlShape } from "react-intl";
import IntlProvider from "./components/IntlProvider";

import "./helpers/babel-polyfill";
import YoastModal from "yoast-components/composites/Plugin/Shared/components/YoastModal";
import SvgIcon from "yoast-components/composites/Plugin/Shared/components/SvgIcon";
import modals from "./components/modals";

const StyledButton = styled.button`
	// Increase specificity to override WP rules.
	&& {
		display: flex;
		align-items: center;
	}

	.yoast-svg-icon {
		margin: 1px 7px 0 0;
		fill: currentColor;
	}
`;

class Modal extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			modalIsOpen: false,
		};

		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );

		this.appElement = document.querySelector( this.props.appElement );
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
				<StyledButton
					type="button"
					onClick={ this.openModal }
					className={ `${ this.props.classes.openButton } yoast-modal__button-open` }
				>
					{ this.props.openButtonIcon && <SvgIcon icon={ this.props.openButtonIcon } size="13px" /> }
					{ this.props.labels.open }
				</StyledButton>
				<YoastModal
					isOpen={ this.state.modalIsOpen }
					onClose={ this.closeModal }
					modalAriaLabel={ this.props.labels.modalAriaLabel }
					appElement={ this.appElement }
					heading={ this.props.labels.heading }
					closeIconButton={ this.props.labels.closeIconButton }
					closeIconButtonClassName={ this.props.classes.closeIconButton }
					closeButton={ this.props.labels.closeButton }
					closeButtonClassName={ this.props.classes.closeButton }
				>
					<ModalContent />
				</YoastModal>
			</React.Fragment>
		);
	}
}

Modal.propTypes = {
	className: PropTypes.string,
	appElement: PropTypes.string.isRequired,
	openButtonIcon: PropTypes.string,
	labels: PropTypes.object,
	content: PropTypes.string.isRequired,
	classes: PropTypes.object,
	intl: intlShape.isRequired,
};

const ModalIntl = injectIntl( Modal );

if ( window.yoastModalConfig ) {
	yoastModalConfig.forEach(
		( config ) => {
			if ( ! config.mountHook || ! config.content ) {
				return;
			}

			const element = document.querySelector( config.mountHook );

			if ( element ) {
				ReactDOM.render(
					<IntlProvider messages={ config.intl }>
						<ModalIntl
							mountHook={ config.mountHook }
							appElement={ config.appElement }
							openButtonIcon={ config.openButtonIcon }
							labels={ config.intl }
							content={ config.content }
							classes={ config.classes }
						/>
					</IntlProvider>,
					element
				);
			}
		}
	);
}
