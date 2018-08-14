import React from "react";
import { ButtonSection } from "yoast-components";
import { Button, Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n/build/index";
import SnippetEditorWrapper from "../containers/SnippetEditor";

class SnippetPreviewModal extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
		};
	}

	openModal() {
		this.setState( { isOpen: true } );
	}

	closeModal() {
		this.setState( { isOpen: false } );
	}

	render() {
		return (
			<div>
				<ButtonSection
					title={ __( "Snippet preview", "wordpress-seo" ) }
					suffixIcon={ { icon: "edit" } }
					hasSeparator={ true }
					onClick={ this.openModal.bind( this ) }
					{ ...this.props }
				/>
				<p onClick={ this.openModal.bind( this ) } > Snippet Preview Editor </p>
				{ this.state.isOpen
					? <Modal
						title="Snippet Preview"
						onRequestClose={ this.closeModal.bind( this ) }>
						<SnippetEditorWrapper editorAlwaysOpen={true} hasPaperStyle={false} />
						<Button isDefault onClick={ this.closeModal.bind( this ) }>
							Close
						</Button>
					</Modal>
					: null }
			</div>
		);
	}
}

export default SnippetPreviewModal;
