import { Modal } from "@wordpress/components";
import { Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, SvgIcon } from "@yoast/components";
import { getAuthentication } from "../../../helpers/wordproofEndpoints";
import { handleAPIResponse } from "../../../helpers/api";

/**
 * Determines the text on the button to open a workout.
 *
 * @returns {wp.Element} The modal.
 */

const performAuthenticationRequest = async() => {
	return await handleAPIResponse(
		() => getAuthentication(),
		( response ) => {
			return response.is_authenticated;
		},
		( response ) => {
			return false;
		}
	);
};
export const AuthenticationModal = ( props ) => {
	const { isOpen, setIsOpen, isAuthenticated, setIsAuthenticated } = props;
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		if ( isOpen && isLoading && isAuthenticated ) {
			setIsLoading( false );
		}

		if ( isOpen && ! isAuthenticated ) {
			setIsLoading( true );
		}

		( async() => {
			while ( isOpen && isLoading && ! isAuthenticated ) {
				const isAuthenticatedRequestResponse = await performAuthenticationRequest();
				if ( isAuthenticatedRequestResponse !== isAuthenticated ) {
					setIsAuthenticated( isAuthenticatedRequestResponse );
				}
				await new Promise( r => setTimeout( r, 2000 ) );
			}
		} )();
	}, [ isOpen, isAuthenticated, isLoading ] );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	return (
		<Fragment>
			{ isOpen && isLoading &&
			<Modal
				onRequestClose={ closeModal }
				title={ __( "Connecting with WordProof", "wordpress-seo" ) }
				className="wordproof__authentication"
				icon={ <span className="yoast-icon" /> }
			>
				<div>
					<SvgIcon icon="loading-spinner" className={ "block" } />
					<em>{ __(
						"Waiting to be authenticated. Please login or signup in the opened window.",
						"wordpress-seo" ) }</em>
				</div>
			</Modal>
			}

			{ isOpen && ! isLoading &&
			<Modal
				onRequestClose={ closeModal }
				title={ __( "Connected to WordProof", "wordpress-seo" ) }
				className="wordproof__authentication"
				icon={ <span className="yoast-icon" /> }
			>
				<div className="wordproof__authentication_outcome">
					<div>
						{ /* TODO: Add image */ }
						{ /* TODO: replace page with post type. Correctly display strong tag. */ }
						<p>{ __( "Your page is now protect via the blockchain!", "wordpress-seo" ) }</p>
						<p>{ !! __( "The page will automatically be Timestamped every time you <strong>update</strong> or <strong>publish</strong>.!", "wordpress-seo" ) }</p>
					</div>
					<br />
					<Button
						onClick={ closeModal }
						className="yoast__wordproof__close-modal"
					>
						{ __( "Continue", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal>
			}
		</Fragment>
	);
};

AuthenticationModal.propTypes = {};
