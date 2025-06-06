/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { NewButton, ButtonStyledLink } from "@yoast/components";

/* Internal dependencies */
import { Modal } from "@yoast/related-keyphrase-suggestions";

/**
 * Redux container for the RelatedKeyPhrasesModal modal.
 */
class SEMrushRelatedKeyphrasesModal extends Component {
	/**
	 * Constructs the RelatedKeyPhrasesModal component.
	 *
	 * @param {Object} props The properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onModalOpen      = this.onModalOpen.bind( this );
		this.onLinkClick      = this.onLinkClick.bind( this );
		this.listenToMessages = this.listenToMessages.bind( this );
	}

	/**
	 * Handles the click event on the "Get related keyphrases" button.
	 *
	 * @returns {void}
	 */
	onModalOpen() {
		const {
			keyphrase,
			onOpenWithNoKeyphrase,
			onOpen,
			location,
			newRequest,
			countryCode,
		} = this.props;
		if ( ! keyphrase.trim() ) {
			onOpenWithNoKeyphrase();
			return;
		}

		onOpen( location );
		newRequest( countryCode, keyphrase );
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
		if ( ! this.props.keyphrase.trim() ) {
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

		if ( ! this.popup || this.popup.closed ) {
			this.popup = window.open( url, "SEMrush_login", features.join( "," ) );
		}
		if ( this.popup ) {
			this.popup.focus();
		}
		window.addEventListener( "message", this.listenToMessages, false );
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
	 * Renders the RelatedKeyPhrasesModal modal component.
	 *
	 * @returns {wp.Element} The RelatedKeyPhrasesModal modal component.
	 */
	render() {
		const { keyphrase, location, whichModalOpen, isLoggedIn, onClose, countryCode, learnMoreLink } = this.props;

		const insightsLink = new URL( "https://www.semrush.com/analytics/keywordoverview/" );
		insightsLink.searchParams.append( "q", keyphrase );
		insightsLink.searchParams.append( "db", countryCode );

		return (
			<Fragment>
				{ isLoggedIn && <div className={ "yoast" }>
					<NewButton
						variant={ "secondary" }
						id={ `yoast-get-related-keyphrases-${location}` }
						onClick={ this.onModalOpen }
					>
						{ __( "Get related keyphrases", "wordpress-seo" ) }
					</NewButton>
				</div> }
				<Modal
					isOpen={ Boolean( keyphrase ) && whichModalOpen === location }
					onClose={ onClose }
					insightsLink={ insightsLink.toString() }
					learnMoreLink={ learnMoreLink }
				>

					<Slot name="YoastRelatedKeyphrases" />

				</Modal>
				{ ! isLoggedIn && <div className={ "yoast" }>
					<ButtonStyledLink
						variant={ "secondary" }
						id={ `yoast-get-related-keyphrases-${location}` }
						href={ "https://oauth.semrush.com/oauth2/authorize?" +
							"ref=1513012826&client_id=yoast&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fyoast%2Fsuccess&" +
							"response_type=code&scope=user.id" }
						onClick={ this.onLinkClick }
					>
						{ __( "Get related keyphrases", "wordpress-seo" ) }
						<span className="screen-reader-text">
							{
								/* translators: Hidden accessibility text. */
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
					</ButtonStyledLink>
				</div> }
			</Fragment>
		);
	}
}

SEMrushRelatedKeyphrasesModal.propTypes = {
	keyphrase: PropTypes.string,
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
	countryCode: PropTypes.string,
	learnMoreLink: PropTypes.string,
	newRequest: PropTypes.func.isRequired,
};

SEMrushRelatedKeyphrasesModal.defaultProps = {
	keyphrase: "",
	location: "",
	whichModalOpen: "none",
	isLoggedIn: false,
	countryCode: "en_US",
	learnMoreLink: "",
};

export default SEMrushRelatedKeyphrasesModal;
