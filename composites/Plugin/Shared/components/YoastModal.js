import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import SvgIcon from "./SvgIcon";

const StyledHeading = styled.h1`
	float: left;
	margin: -4px 0 2rem;
	font-size: 1rem;
`;

const StyledButton = styled.button`
	float: right;
	width: 44px;
	height: 44px;
	background: transparent;
	border: 0;
	margin: -16px -16px 0 0;
	padding: 0;
	cursor: pointer;
`;

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
				{
					this.props.heading &&
						<StyledHeading className="yoast-modal__title">{ this.props.heading }</StyledHeading>
				}
				{
					this.props.closeIconButton &&
						<StyledButton
							onClick={ this.props.onClose }
							className={ `${ this.props.xCloseButtonClassName } yoast-modal__button-close-icon` }
							aria-label={ this.props.closeIconButton }
						>
							<SvgIcon icon="times" color={ colors.$color_grey_text } />
						</StyledButton>
				}
				<div className="yoast-modal__inside">
					{ this.props.children }
				</div>
				{
					this.props.closeButton &&
						<div className="yoast-modal__actions">
							<button
								type="button"
								onClick={ this.props.onClose }
								className={ `${ this.props.closeButtonClassName } yoast-modal__button-close` }
							>
								{ this.props.closeButton }
							</button>
						</div>
				}
			</Modal>
		);
	}
}

BaseYoastModal.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	modalAriaLabel: PropTypes.string.isRequired,
	appElement: PropTypes.object.isRequired,
	heading: PropTypes.string,
	closeIconButton: PropTypes.string,
	closeButton: PropTypes.string,
	xCloseButtonClassName: PropTypes.string,
	closeButtonClassName: PropTypes.string,
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

	.yoast-modal__inside {
		clear: both;
	}

	.yoast-modal__actions {
		text-align: right;
	}

	.yoast-modal__actions button {
		margin: 24px 0 0 8px;
	}
`;

export default YoastModal;
