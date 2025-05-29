import { useSelect } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { Fragment, render, useCallback, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Modal, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { get } from "lodash";
import { HAS_AI_GENERATOR_CONSENT_NAME, PLUGIN_URL_NAME } from "../shared-admin/store";
import { GrantConsent } from "./components/grant-consent";
import { RevokeConsent } from "./components/revoke-consent";
import { STORE_NAME_AI_CONSENT } from "./constants";
import { registerStore } from "./store";

domReady( () => {
	registerStore( {
		[ HAS_AI_GENERATOR_CONSENT_NAME ]: get( window, "wpseoAiConsent.hasConsent", false ) === "1",
		[ PLUGIN_URL_NAME ]: get( window, "wpseoAiConsent.pluginUrl", "" ),
	} );

	/**
	 * Renders the grant/revoke consent button.
	 * @returns {JSX.Element} The element.
	 */
	const App = () => {
		const hasConsent = useSelect( select => select( STORE_NAME_AI_CONSENT ).selectHasAiGeneratorConsent(), [] );
		const [ isModalOpen, , , openModal, closeModal ] = useToggleState( false );
		const focusElementRef = useRef( null );
		const handleClick = useCallback( e => {
			e.preventDefault();
			openModal();
		}, [ openModal ] );

		return (
			<Fragment>
				<Modal
					className="yst-introduction-modal"
					isOpen={ isModalOpen }
					onClose={ closeModal }
					initialFocus={ focusElementRef }
				>
					<Modal.Panel
						className={ classNames(
							! hasConsent && "yst-p-0 yst-max-w-lg yst-rounded-3xl",
							hasConsent && "yst-max-w-xl yst-rounded-lg"
						) }
					>
						{ ! hasConsent && <GrantConsent
							onStartGenerating={ closeModal }
							focusElementRef={ focusElementRef }
						/> }
						{ hasConsent && <RevokeConsent onClose={ closeModal } /> }
					</Modal.Panel>
				</Modal>
				<button
					className="button"
					id="ai-generator-consent-button"
					onClick={ handleClick }
				>
					{ hasConsent
						? __( "Revoke consent", "wordpress-seo" )
						: __( "Grant consent", "wordpress-seo" )
					}
				</button>
			</Fragment>
		);
	};

	const root = document.getElementById( "ai-generator-consent" );
	if ( root ) {
		render( <App />, root );
	}
} );
