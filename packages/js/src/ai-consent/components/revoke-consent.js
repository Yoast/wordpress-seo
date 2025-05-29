import ExclamationIcon from "@heroicons/react/outline/esm/ExclamationIcon";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, Modal } from "@yoast/ui-library";

import { STORE_NAME_AI_CONSENT } from "../constants";

/**
 * The modal content for revoking consent to use the AI features.
 *
 * @param {function} onClose Callback to close the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const RevokeConsent = ( { onClose } ) => {
	const { storeAiGeneratorConsent } = useDispatch( STORE_NAME_AI_CONSENT );
	const endpoint = useSelect( select => select( STORE_NAME_AI_CONSENT ).selectAiGeneratorConsentEndpoint(), [] );

	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( false );

	const handleRevokeConsent = useCallback( async() => {
		setError( false );
		setIsLoading( true );


		const response = await storeAiGeneratorConsent( false, endpoint );
		console.log( "Revoke consent response", response );
		if ( response.consent === false ) {
			setError( true );
			setIsLoading( false );
			return;
		}
		onClose();

		setIsLoading( false );
	}, [ storeAiGeneratorConsent, setIsLoading, onClose, endpoint ] );

	return (
		<div className="yst-flex yst-flex-row">
			<span
				className={
					"yst-shrink-0 yst-h-12 yst-w-12 yst-rounded-full yst-flex yst-justify-center yst-items-center yst-mb-3 yst-me-5 yst-bg-red-100"
				}
			>
				<ExclamationIcon className="yst-w-6 yst-h-6 yst-align-center yst-text-red-600" />
			</span>
			<div>
				<Modal.Title
					className="yst-font-semibold"
					as="h3"
					size="4"
				>
					{ __( "Revoke AI consent", "wordpress-seo" ) }
				</Modal.Title>
				{ error && <Alert
					className="yst-mt-2"
					variant="error"
				>
					{ __( "Something went wrong, please try again later.", "wordpress-seo" ) }
				</Alert> }
				<p className="yst-mt-2 yst-text-slate-600">
					{   }
					{ __( "By revoking your consent, you will no longer have access to Yoast AI features. Are you sure you want to revoke your consent?", "wordpress-seo" ) }
				</p>
				<footer className="yst-mt-6 sm:yst-flex sm:yst-flex-row-reverse">
					<Button
						variant="error"
						isLoading={ isLoading }
						className="yst-w-full sm:yst-w-auto yst-revoke-button"
						onClick={ handleRevokeConsent }
					>
						{
							__( "Yes, revoke consent", "wordpress-seo" )
						}
					</Button>
					<Button
						variant="secondary"
						className="yst-w-full sm:yst-w-auto yst-me-3"
						onClick={ onClose }
					>
						{
							__( "Close", "wordpress-seo" )
						}
					</Button>
				</footer>
			</div>
		</div>
	);
};
