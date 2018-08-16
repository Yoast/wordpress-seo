import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import YoastModal from "yoast-components/composites/Plugin/Shared/components/YoastModal";
import SvgIcon from "yoast-components/composites/Plugin/Shared/components/SvgIcon";

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

		this.openModal  = this.openModal.bind( this );
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
					{ this.props.children }
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
	classes: PropTypes.object,
};

export default Modal;
