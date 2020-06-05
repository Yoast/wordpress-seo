/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Button, Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { BaseButton} from "@yoast/components";

/* Internal dependencies */
import RelatedKeyPhrasesWrapper from "../containers/RelatedKeyphrases";

class RelatedKeyPhrasesModal extends Component {
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

				<BaseButton
					id={ "yoast-get-related-keyphrases" }
					title={ __( "Get related keyphrases", "wordpress-seo" ) }
					suffixIcon={ { size: "20px", icon: "pencil-square" } }
					hasSeparator={ true }
					onClick={ this.openModal }
					{ ...this.props }
				>
					{ __( "Get related keyphrases", "wordpress-seo" ) }
				</BaseButton>
				{ this.state.isOpen &&
				<Modal
					title={ __( "Get related keyphrases", "wordpress-seo" ) }
					onRequestClose={ this.closeModal }
				>
					<RelatedKeyPhrasesWrapper />
					<Button isSecondary={ true } onClick={ this.closeModal }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>

				</Modal>
				}
			</Fragment>
		);
	}
}

export default RelatedKeyPhrasesModal;
