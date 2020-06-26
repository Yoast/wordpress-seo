import { Component, Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

import { Modal as YoastModal, SvgIcon } from "@yoast/components";

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
 * @returns {wp.Element} The Modal component.
 */
class Modal extends Component {
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

		this.appElement = document.querySelector( this.props.appElement );
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
	 * @returns {wp.Element} The rendered react element.
	 */
	render() {
		const defaultLabels = {
			open: __( "Open", "wordpress-seo" ),
			heading: "",
			closeIconButton: __( "Close", "wordpress-seo" ),
			closeButton: "",
		};

		const modalLabels = Object.assign( {}, defaultLabels, this.props.labels );

		return (
			<Fragment>
				<StyledButton
					type="button"
					onClick={ this.openModal }
					className={ `${ this.props.classes.openButton } yoast-modal__button-open` }
				>
					{ this.props.openButtonIcon && <SvgIcon icon={ this.props.openButtonIcon } size="13px" /> }
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
					closeIconButtonClassName={ this.props.classes.closeIconButton }
					closeButton={ modalLabels.closeButton }
					closeButtonClassName={ this.props.classes.closeButton }
				>
					{ this.props.children }
				</YoastModal>
			</Fragment>
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
	} ).isRequired,
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
	appElement: "#wpwrap",
	openButtonIcon: "",
	classes: {},
};

export default Modal;
