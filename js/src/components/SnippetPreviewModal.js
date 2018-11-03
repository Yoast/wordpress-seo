import React from "react";
import { ButtonSection } from "yoast-components";
import { Button, Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import SnippetEditorWrapper from "../containers/SnippetEditor";

class SnippetPreviewModal extends React.Component {
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
			<React.Fragment>
				<ButtonSection
					title={ __( "Snippet preview", "wordpress-seo" ) }
					suffixIcon={ { size: "20px", icon: "pencil-square" } }
					hasSeparator={ true }
					onClick={ this.openModal }
					{ ...this.props }
				/>
				{ this.state.isOpen && <Modal
					title={ __( "Snippet preview", "wordpress-seo" ) }
					onRequestClose={ this.closeModal }
				>
					<SnippetEditorWrapper showCloseButton={ false } hasPaperStyle={ false } />
					<Button isDefault={ true } onClick={ this.closeModal }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>
				</Modal>
				}
			</React.Fragment>
		);
	}
}

export default SnippetPreviewModal;
