import { Modal } from "@wordpress/components";
import { Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, SvgIcon } from "@yoast/components";
import { getAuthentication } from "../../../helpers/wordproofEndpoints";
import { handleAPIResponse } from "../../../helpers/api";
import { ReactComponent as WordProofConnectedImage } from "../../../../../../images/mirrored_fit_bubble_woman_1_optim.svg";


/**
 * Determines the text on the button to open a workout.
 *
 * @returns {wp.Element} The modal.
 */

const performAuthenticationRequest = async() => {
	return await handleAPIResponse(
		getAuthentication,
		( response ) => {
			return response.is_authenticated;
		},
		( response ) => {
			return false;
		}
	);
};
export const AuthenticationModal = ( props ) => {
	const { isOpen, setIsOpen, isAuthenticated, setIsAuthenticated, postTypeName } = props;
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		const authenticate = async() => {
			setIsLoading( true );
			const isAuthenticated = await performAuthenticationRequest();

			if ( isAuthenticated ) {
				setIsLoading( false );
				return setIsAuthenticated( true );
			}

			await new Promise( r => setTimeout( r, 2000 ) );
			return authenticate();
		};

		if ( isOpen && ! isAuthenticated ) {
			authenticate();
		}
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
						<p>{ sprintf(
							/* Translators: %s translates to the Post type in singular form */
							__( "You have successfully connected to WordProof!\nThis %s will be timestamped as soon as you update it.", "wordpress-seo" ),
							postTypeName
						) }</p>

						<div
							style={ {
								display: "flex",
								justifyContent: "center",
							} }
						>
							<WordProofConnectedImage style={ { width: "100px" } } />
						</div>
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
