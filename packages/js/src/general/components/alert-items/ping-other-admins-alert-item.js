/* eslint-disable complexity */
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { select, useDispatch } from "@wordpress/data";
import { useState, useCallback, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmail } from "@wordpress/url";
import { Button, TextField } from "@yoast/ui-library";
import { STORE_NAME } from "../../constants";
import { useSelectGeneralPage } from "../../hooks";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { buildNewsletterSource } from "../../../helpers/buildNewsletterSource";

/**
 * A function to send a request to the mailing list API.
 *
 * @param {string} email The email to signup to the newsletter.
 * @param {boolean} isPremium Whether Premium is active.
 * @param {Array} activeAddons A list of add-ons and whether they are active.
 *
 * @returns {Object} The request's response.
 */
async function mailingListSubscribe( email, isPremium, activeAddons ) {
	const source = buildNewsletterSource( "recapture", isPremium, activeAddons );

	const mailingListResponse = await fetch( "https://my.yoast.com/api/Mailing-list/subscribe", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify( {
			customerDetails: {
				firstName: "",
				email: email,
			},
			list: "Yoast newsletter",
			source: source,
		} ),
	} );

	return mailingListResponse.json();
}

/**
 * A function to request permanently resolving the alert.
 *
 * @param {string} id The alert ID.
 * @param {string} resolveNonce The nonce to resolve the alert.
 *
 * @returns {Object} The request's response.
 */
async function resolveAlert( id, resolveNonce ) {
	const formData = new FormData();
	formData.append( "action", "wpseo_resolve_alert" );
	formData.append( "alertId", id );
	formData.append( "_ajax_nonce", resolveNonce );

	const ajaxUrl = select( STORE_NAME ).selectPreference( "ajaxUrl" );

	const resolveResponse = await fetch( ajaxUrl, {
		method: "POST",
		body: formData,
	} );

	return resolveResponse.json();
}

/**
 * Ping other admins alert item component.
 *
 * @param {string} id Alert ID.
 * @param {boolean} dismissed Whether the alert is dismissed.
 * @param {string} message Alert message.
 * @param {string} resolveNonce Nonce to resolve the alert.
 * @returns {JSX.Element} The PingOtherAdminsAlertItem component.
 */
export const PingOtherAdminsAlertItem = ( { id, dismissed, message, resolveNonce } ) => {
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( "" );
	const { removeAlert, setResolveSuccessMessage } = useDispatch( STORE_NAME );
	const isPremium = useSelectGeneralPage( "selectPreference", [], "isPremium" );
	const activeAddons = useSelectGeneralPage( "selectPreference", [], "activeAddons" );
	const inputRef = useRef();

	const clearError = useCallback( () => {
		setError( "" );
	}, [] );

	const handleSendClick = useCallback( async() => {
		const emailInput = inputRef.current;
		const email = emailInput ? emailInput.value.trim() : "";

		if ( ! isEmail( email ) ) {
			setError( __( "Please enter a valid email address.", "wordpress-seo" ) );
			return;
		}

		setIsLoading( true );
		setError( "" );

		try {
			// First request to Yoast mailing list API
			const subscribeResponse = await mailingListSubscribe( email, isPremium, activeAddons );

			// Check if subscription was successful
			if ( subscribeResponse.status !== "subscribed" ) {
				setError( __( "Failed to subscribe to mailing list.", "wordpress-seo" ) );
				return;
			}

			// Second request to resolve the alert
			const resolveResponse = await resolveAlert( id, resolveNonce );
			if ( ! resolveResponse.success ) {
				setError( resolveResponse.data?.message || __( "Failed to resolve alert.", "wordpress-seo" ) );
				return;
			}

			setResolveSuccessMessage( __( "Successfully subscribed!", "wordpress-seo" ) );
			removeAlert( id );
		} catch ( err ) {
			setError( __( "An error occurred. Please try again.", "wordpress-seo" ) );
			console.error( "Error in handleSendClick:", err );
		} finally {
			setIsLoading( false );
		}
	}, [ id, resolveNonce, setIsLoading, setError, removeAlert, setResolveSuccessMessage ] );

	return (
		<div
			className={ classNames(
				"yst-text-sm yst-text-slate-600 yst-grow",
				dismissed && "yst-opacity-50" ) }
		>
			<div
				dangerouslySetInnerHTML={ { __html: message } }
			/>
			<div className="yst-flex yst-items-end yst-gap-2 yst-mt-2">
				<TextField
					type="email"
					name={ id + "-input-field" }
					id={ id + "-input-field" }
					label=""
					placeholder={ __( "E.g. example@email.com", "wordpress-seo" ) }
					className="yst-flex-1"
					disabled={ isLoading || dismissed }
					onInput={ clearError }
					ref={ inputRef }
					onChange={ noop }
				/>
				<Button
					variant="primary"
					size="large"
					onClick={ handleSendClick }
					isLoading={ isLoading }
					disabled={ isLoading || dismissed }
				>
					{ __( "Send", "wordpress-seo" ) }
					<div className="yst-ml-2 yst-w-4">
						<ArrowNarrowRightIcon className="yst-w-4 yst-text-white" />
					</div>
				</Button>
			</div>

			{ error && (
				<p className="yst-text-red-600 yst-text-xs yst-mt-1">
					{ error }
				</p>
			) }

			<p
				className="yst-text-slate-600 yst-text-xxs yst-leading-4 yst-mt-1"
			>
				{
					safeCreateInterpolateElement(
						sprintf(
							/**
							 * translators: %1$s and %2$s expand to opening and closing <a> tags.
							 */
							__( "Yoast respects your privacy. Read %1$sour privacy policy%2$s on how we handle your personal information.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						{
							// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
							a: <a href={ select( STORE_NAME ).selectLink( "https://yoa.st/gdpr-config-workout" ) } target="_blank" rel="noopener" />,
						}
					)
				}
			</p>
		</div>
	);
};

PingOtherAdminsAlertItem.propTypes = {
	id: PropTypes.string.isRequired,
	dismissed: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	resolveNonce: PropTypes.string.isRequired,
};
