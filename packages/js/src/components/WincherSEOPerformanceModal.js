/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import without from "lodash/without";

/* Yoast dependencies */
import { NewButton, ButtonStyledLink } from "@yoast/components";


/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import Modal from "./modals/Modal";
import { ReactComponent as YoastIcon } from "../../images/Yoast_icon_kader.svg";
import { isCloseEvent } from "./modals/editorModals/EditorModal.js";
import SidebarButton from "./SidebarButton";

/**
 * Redux container for the SEOPerformanceModal modal.
 */
class WincherSEOPerformanceModal extends Component {
	/**
	 * Constructs the SEOPerformanceModal component.
	 *
	 * @param {Object} props The properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onModalOpen      = this.onModalOpen.bind( this );
		this.onModalClose     = this.onModalClose.bind( this );
		this.onLinkClick      = this.onLinkClick.bind( this );
		this.listenToMessages = this.listenToMessages.bind( this );
	}

	/**
	 * Handles the click event on the "Get related keyphrase" button.
	 *
	 * @returns {void}
	 */
	onModalOpen() {
		if ( without( this.props.keyphrases, "", null ).length === 0 ) {
			this.props.onOpenWithNoKeyphrase();
			return;
		}

		this.props.onOpen( this.props.location );
	}

	/**
	 * Handles the close event for the modal.
	 *
	 * @param {Event} event The event passed to the onRequestClose.
	 *
	 * @returns {void}
	 */
	onModalClose( event ) {
		if ( ! isCloseEvent( event ) ) {
			return;
		}

		this.props.onClose();
	}

	/**
	 * Opens the popup window.
	 *
	 * @param {event} e The click event.
	 *
	 * @returns {void}
	 */
	onLinkClick( e ) {
		e.preventDefault();

		// If no keyphrase has been submitted, trigger the error message immediately.
		if ( without( this.props.keyphrases, "", null ).length === 0 ) {
			this.props.onOpenWithNoKeyphrase();
			return;
		}

		const url    = e.target.href;
		const height = "570";
		const width  = "340";
		const top    = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
		const left   = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );

		const features = [
			"top=" + top,
			"left=" + left,
			"width=" + width,
			"height=" + height,
			"resizable=1",
			"scrollbars=1",
			"status=0",
		];

		// if ( ! this.popup || this.popup.closed ) {
		// 	this.popup = window.open( url, "SEMrush_login", features.join( "," ) );
		// }
		// if ( this.popup ) {
		// 	this.popup.focus();
		// }
		// window.addEventListener( "message", this.listenToMessages, false );
	}

	/**
	 * Listens to message events from the SEMrush popup.
	 *
	 * @param {event} event The message event.
	 *
	 * @returns {void}
	 */
	async listenToMessages( event ) {
		const { data, source, origin } = event;

		// Check that the message comes from the expected origin.
		if ( origin !== "https://oauth.semrush.com" || this.popup !== source ) {
			return;
		}

		if ( data.type === "semrush:oauth:success" ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.listenToMessages, false );
			await this.performAuthenticationRequest( data );
		}

		if ( data.type === "semrush:oauth:denied" ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.listenToMessages, false );
			this.props.onAuthentication( false );
		}
	}

	/**
	 * Get the tokens using the provided code after user has granted authorization.
	 *
	 * @param {object} data The message data.
	 *
	 * @returns {void}
	 */
	async performAuthenticationRequest( data ) {
		try {
			const url      = new URL( data.url );
			const code     = url.searchParams.get( "code" );
			const response = await apiFetch( {
				path: "yoast/v1/semrush/authenticate",
				method: "POST",
				data: { code: code },
			} );

			if ( response.status === 200 ) {
				this.props.onAuthentication( true );
				this.onModalOpen();
				// Close the popup if it's been opened again by mistake.
				this.popup.close();
			} else {
				console.error( response.error );
			}
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
		}
	}

	/**
	 * Renders the SEOPerformanceModal modal component.
	 *
	 * @returns {wp.Element} The SEOPerformanceModal modal component.
	 */
	render() {
		const { keyphrases, location, whichModalOpen, isLoggedIn } = this.props;
		const title = __( "Track SEO performance", "wordpress-seo" );

		return (
			<Fragment>
				{ keyphrases && whichModalOpen === location &&
				<Modal
					title={ title }
					onRequestClose={ this.onModalClose }
					icon={ <YoastIcon /> }
					additionalClassName="yoast-wincher-seo-performance-modal"
				>
					<ModalContainer
						className="yoast-gutenberg-modal__content yoast-wincher-seo-performance-modal__content"
					>
						<h2>Hello world</h2>
					</ModalContainer>
				</Modal>
				}

				<SidebarButton
					id={ `wincher-open-button-${location}` }
					title={ title }
					suffixIcon={ { size: "20px", icon: "pencil-square" } }
					onClick={ this.onModalOpen }
				/>

				{ ! isLoggedIn && <div className={ "yoast" }>
					{/*<ButtonStyledLink*/}
					{/*	variant={ "secondary" }*/}
					{/*	id={ `yoast-get-related-keyphrase-${location}` }*/}
					{/*	href={ "https://oauth.semrush.com/oauth2/authorize?" +*/}
					{/*	"ref=1513012826&client_id=yoast&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fyoast%2Fsuccess&" +*/}
					{/*	"response_type=code&scope=user.id" }*/}
					{/*	onClick={ this.onLinkClick }*/}
					{/*>*/}
					{/*	{ __( "Get related keyphrase", "wordpress-seo" ) }*/}
					{/*	<span className={ "screen-reader-text" }>*/}
					{/*		{ __( "(Opens in a new browser window)", "wordpress-seo" ) }*/}
					{/*	</span>*/}
					{/*</ButtonStyledLink>*/}

				</div> }
			</Fragment>
		);
	}
}

WincherSEOPerformanceModal.propTypes = {
	keyphrases: PropTypes.array,
	location: PropTypes.string,
	whichModalOpen: PropTypes.oneOf( [
		"none",
		"metabox",
		"sidebar",
	] ),
	isLoggedIn: PropTypes.bool,
	onOpen: PropTypes.func.isRequired,
	onOpenWithNoKeyphrase: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onAuthentication: PropTypes.func.isRequired,
};

WincherSEOPerformanceModal.defaultProps = {
	keyphrases: [],
	location: "",
	whichModalOpen: "none",
	isLoggedIn: false,
};

export default WincherSEOPerformanceModal;
