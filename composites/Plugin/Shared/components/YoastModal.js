import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import styled from "styled-components";
import { injectIntl, intlShape } from "react-intl";

class BaseYoastModal extends React.Component {

	constructor( props ) {
		super( props );
	}

	/**
	 * Returns the rendered html.
	 *
	 * @returns {ReactElement} The rendered html.
	 */
	render() {
		console.log( "props in component", this.props );
		return (
			<Modal
				isOpen={ this.props.isOpen }
				onRequestClose={ this.props.onClose }
				role="dialog"
				contentLabel={ this.props.modalAriaLabel }
				overlayClassName={ `${ this.props.className } yoast-modal__overlay` }
				className={ `${ this.props.className } yoast-modal__content` }
				appElement={ this.props.appElement }
			>
				{ this.props.children }
			</Modal>
		);
	}
}

BaseYoastModal.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	intl: intlShape.isRequired,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	modalAriaLabel: PropTypes.string.isRequired,
	appElement: PropTypes.object.isRequired,
};

BaseYoastModal.defaultProps = {
	isOpen: false,
};

const YoastModal = styled( BaseYoastModal )`
	&.yoast-modal__overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		transition: background 100ms ease-out;
		z-index: 999999;
	}

	&.yoast-modal__content {
		position: absolute;
		top: 50%;
		left: 50%;
		right: auto;
		bottom: auto;
		width: auto;
		max-width: 90%;
		max-height: 90%;
		border: 0;
		border-radius: 0;
		margin-right: -50%;
		padding: 24px;
		transform: translate(-50%, -50%);
		background-color: #fff;
		outline: none;

		@media screen and ( max-width: 500px ) {
			overflow-y: auto;
		}

		@media screen and ( max-height: 640px ) {
			overflow-y: auto;
		}
	}

	.yoast-modal__actions {
		padding-top: 1em;
		text-align: right;
	}

	.yoast-modal__actions button {
		margin-left: 1em;
	}
`;

export default injectIntl( YoastModal );
