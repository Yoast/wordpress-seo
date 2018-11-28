import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

import { YoastModal, SvgIcon } from "yoast-components";

const defaultProps = {
	appElement: "#wpwrap",
	openButtonIcon: "",
	labels: {
		open: __( "Open", "wordpress-seo" ),
		modalAriaLabel: "",
		heading: "",
		closeIconButton: __( "Close", "wordpress-seo" ),
		closeButton: "",
	},
	classes: {
		openButton: "",
		closeIconButton: "",
		closeButton: "",
	},
};

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

/**
 * Returns the Modal component.
 *
 * @returns {ReactElement} The Modal component.
 */
class Modal extends React.Component {
	/**
	 * Constructs the Modal component.
	 *
	 * @param {Object} props The component properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			modalIsOpen: false,
		};

		this.openModal  = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );

		this.appElement = document.querySelector( this.props.appElement || defaultProps.appElement );
	}

	/**
	 * Sets the Modal state to open.
	 *
	 * @returns {void}
	 */
	openModal() {
		this.setState( {
			modalIsOpen: true,
		} );
	}

	/**
	 * Sets the Modal state to closed.
	 *
	 * @returns {void}
	 */
	closeModal() {
		this.setState( {
			modalIsOpen: false,
		} );
	}

	/**
	 * Renders the Modal component.
	 *
	 * @returns {ReactElement} The rendered react element.
	 */
	render() {
		const openButtonIcon = this.props.openButtonIcon || defaultProps.openButtonIcon;
		const modalLabels = Object.assign( {}, defaultProps.labels, this.props.labels );
		const modalClasses = Object.assign( {}, defaultProps.classes, this.props.classes );

		return (
			<React.Fragment>
				<StyledButton
					type="button"
					onClick={ this.openModal }
					className={ `${ modalClasses.openButton } yoast-modal__button-open` }
				>
					{ openButtonIcon && <SvgIcon icon={ openButtonIcon } size="13px" /> }
					{ modalLabels.open }
				</StyledButton>
				<YoastModal
					isOpen={ this.state.modalIsOpen }
					onClose={ this.closeModal }
					className={ this.props.className }
					modalAriaLabel={ modalLabels.modalAriaLabel }
					appElement={ this.appElement }
					heading={ modalLabels.heading }
					closeIconButton={ modalLabels.closeIconButton }
					closeIconButtonClassName={ modalClasses.closeIconButton }
					closeButton={ modalLabels.closeButton }
					closeButtonClassName={ modalClasses.closeButton }
				>
					{ this.props.children }
				</YoastModal>
			</React.Fragment>
		);
	}
}

Modal.propTypes = {
	appElement: PropTypes.string,
	openButtonIcon: PropTypes.string,
	labels: PropTypes.shape( {
		open: PropTypes.string,
		modalAriaLabel: PropTypes.string.isRequired,
		heading: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ),
	classes: PropTypes.shape( {
		openButton: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ),
	className: PropTypes.string,
	children: PropTypes.any.isRequired,
};

Modal.defaultProps = {
	className: "",
	...defaultProps,
};

export default Modal;
