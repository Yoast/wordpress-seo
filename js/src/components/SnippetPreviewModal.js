/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Button, Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import styled, { createGlobalStyle } from "styled-components";

/* Yoast dependencies */
import { ButtonSection } from "yoast-components";
import { colors, rgba } from "@yoast/style-guide";

/* Internal dependencies */
import SnippetEditorWrapper from "../containers/SnippetEditor";

const OverrideOverlayColor = createGlobalStyle`
	.yoast-modal__screen-overlay {
		background-color: ${ rgba( colors.$color_pink_dark, 0.6 ) };
	}
`;

const ModalContentSpacer = styled.div`
	@media screen and (min-width: 782px) {
		width: 640px;
	}
`;

class SnippetPreviewModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
		};

		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );
	}

	openModal() {
		this.setState( { isOpen: true } );
	}

	closeModal() {
		this.setState( { isOpen: false } );
	}

	render() {
		return (
			<Fragment>
				<ButtonSection
					id={ "yoast-snippet-editor-sidebar" }
					title={ __( "Google preview", "wordpress-seo" ) }
					suffixIcon={ { size: "20px", icon: "pencil-square" } }
					hasSeparator={ true }
					onClick={ this.openModal }
					{ ...this.props }
				/>
				{ this.state.isOpen &&
					<Modal
						title={ __( "Google preview", "wordpress-seo" ) }
						onRequestClose={ this.closeModal }
						overlayClassName="yoast-modal__screen-overlay"
					>
						<ModalContentSpacer>
							<SnippetEditorWrapper showCloseButton={ false } hasPaperStyle={ false } />
						</ModalContentSpacer>
						<Button isDefault={ true } onClick={ this.closeModal }>
							{ __( "Close", "wordpress-seo" ) }
						</Button>
						<OverrideOverlayColor />
					</Modal>
				}
			</Fragment>
		);
	}
}

export default SnippetPreviewModal;
