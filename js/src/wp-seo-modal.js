/* global yoastModalConfig */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import YoastModal from "yoast-components/composites/Plugin/Shared/components/YoastModal";
import modals from "./components/modals";

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
				<button
					type="button"
					onClick={ this.openModal }
					className={ `${ this.props.classes.openButton } yoast-modal__button-open` }
				>
					{ this.props.labels.open }
				</button>
				<YoastModal
					isOpen={ this.state.modalIsOpen }
					onClose={ this.closeModal }
					modalAriaLabel={ this.props.labels.label }
					appElement={ this.appElement }
					heading={ this.props.labels.heading }
					closeIconButton={ this.props.labels.xLabel }
					closeButton={ this.props.labels.close }
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
	labels: PropTypes.object,
	content: PropTypes.string.isRequired,
	classes: PropTypes.object,
};

yoastModalConfig.forEach(
	( config ) => {
		if ( ! config.hook ) {
			return;
		}

		const element = document.querySelector( config.hook );

		if ( element ) {
			ReactDOM.render(
				<Modal
					hook={ config.hook }
					appElement={ config.appElement }
					labels={ config.labels }
					content={ config.content }
					classes={ config.classes }
				/>,
				element
			);
		}
	}
);
