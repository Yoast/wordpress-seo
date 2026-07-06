import ArrowSmRightIcon from "@heroicons/react/solid/ArrowSmRightIcon";
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import ExclamationCircleIcon from "@heroicons/react/solid/ExclamationCircleIcon";
import ExclamationIcon from "@heroicons/react/solid/ExclamationIcon";
import { dispatch, select as wpSelect, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useId, useRef, useState } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { Alert, Button, Link, Notifications, TooltipContainer, TooltipTrigger, TooltipWithContext, useSvgAria, useToggleState } from "@yoast/ui-library";
import { ReactComponent as MyYoastLogo } from "../../../images/myyoast-logo.svg";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { MyyoastConnectionDisconnectModal } from "./myyoast-disconnect-modal";
import { MYYOAST_STORE_NAME } from "./constants";
import { Card } from "../tailwind-components/card";

const LEARN_MORE_LINK = "https://yoa.st/integrations-myyoast";

/**
 * Resolves the user-facing message for a machine code the backend emits
 * (`error_code` for errors, `message_key` for successes).
 *
 * A switch rather than a map so only the matched string is translated, and
 * `__()` runs at call time rather than module load — keeping locale switching
 * working. Unknown codes fall through to the generic error.
 *
 * @param {string} code The backend code.
 * @returns {string} The translated message.
 */
// eslint-disable-next-line complexity
const messageFor = ( code ) => {
	switch ( code ) {
		case "not_provisioned":
			return sprintf(
				/* translators: %1$s expands to MyYoast. %2$s expands to Yoast SEO. */
				__( "Your server doesn't support the %1$s connection. Update %2$s to the latest version. If the issue persists after updating, contact support.", "wordpress-seo" ),
				"MyYoast",
				"Yoast SEO"
			);
		case "registration_gone":
			return sprintf(
				/* translators: %1$s expands to MyYoast. %2$s expands to MyYoast. */
				__( "%1$s no longer recognizes this site. Connect this site to %2$s again to restore the connection.", "wordpress-seo" ),
				"MyYoast",
				"MyYoast"
			);
		case "rate_limited":
			return sprintf(
				/* translators: %1$s expands to MyYoast. */
				__( "%1$s has had a lot of connection attempts from this site or network. Please wait a few minutes and try again.", "wordpress-seo" ),
				"MyYoast"
			);
		case "server_capability":
			return sprintf(
				/* translators: %1$s expands to MyYoast. %2$s expands to Yoast SEO. %3$s expands to Yoast SEO. */
				__( "%1$s doesn't support a feature this version of %2$s needs. Update %3$s to the latest version. If the issue persists, contact support.", "wordpress-seo" ),
				"MyYoast",
				"Yoast SEO",
				"Yoast SEO"
			);
		case "myyoast_unreachable":
			return sprintf(
				/* translators: %1$s expands to MyYoast. %2$s expands to MyYoast. */
				__( "Couldn't reach %1$s from this server. Check your server's outbound network access, then try again. If %2$s is having issues, wait a few minutes and retry.", "wordpress-seo" ),
				"MyYoast",
				"MyYoast"
			);
		case "token_request_failed_invalid_grant":
			return sprintf(
				/* translators: %1$s expands to MyYoast. */
				__( "%1$s rejected the credentials stored for this site. Disconnect and connect this site again to restore the connection.", "wordpress-seo" ),
				"MyYoast"
			);
		case "token_request_failed":
			return sprintf(
				/* translators: %1$s expands to MyYoast. %2$s expands to Yoast SEO. */
				__( "Something went wrong while talking to %1$s. Try again in a moment. If the problem keeps happening, update %2$s or contact support.", "wordpress-seo" ),
				"MyYoast",
				"Yoast SEO"
			);
		case "token_storage_failed":
			return __( "Couldn't save the new credentials on this site. Make sure your WordPress database is writable, then try again.", "wordpress-seo" );
		case "invalid_resource":
			return __( "Something went wrong. Refresh the page and try again. If the problem keeps happening, contact support.", "wordpress-seo" );
		case "registration_failed":
			return sprintf(
				/* translators: %1$s expands to MyYoast. %2$s expands to Yoast SEO. */
				__( "Couldn't connect this site to %1$s. Try again in a moment. If the problem keeps happening, update %2$s or contact support.", "wordpress-seo" ),
				"MyYoast",
				"Yoast SEO"
			);
		case "unknown_redirect_uri":
			return __( "Couldn't verify this site because it's no longer recognized. Refresh the page and try again.", "wordpress-seo" );
		case "invalid_user":
			return __( "You need to be signed in to verify this site.", "wordpress-seo" );
		case "connection_cancelled":
			return __( "Connection cancelled. You can try again whenever you're ready.", "wordpress-seo" );
		case "timeout":
			return sprintf(
				/* translators: %1$s expands to MyYoast. */
				__( "Request to %1$s timed out. Please try again.", "wordpress-seo" ),
				"MyYoast"
			);
		case "connect_success":
			return sprintf(
				/* translators: %1$s expands to MyYoast. */
				__( "This site is now connected to %1$s.", "wordpress-seo" ),
				"MyYoast"
			);
		case "update_success":
			return __( "Connection updated to match this site's current URL.", "wordpress-seo" );
		case "disconnect_success":
			return sprintf(
				/* translators: %1$s expands to MyYoast. */
				__( "This site is no longer connected to %1$s.", "wordpress-seo" ),
				"MyYoast"
			);
		case "verify_success":
			// Emitted by the OAuth callback for both first-time setup and a
			// standalone re-verify, so the copy describes the end state rather
			// than the "verify" action.
			return sprintf(
				/* translators: %1$s expands to MyYoast. */
				__( "Your %1$s connection is now active.", "wordpress-seo" ),
				"MyYoast"
			);
		default:
			return sprintf(
				/* translators: %1$s expands to Yoast SEO. */
				__( "Something went wrong. Try again in a moment. If the problem keeps happening, update %1$s or contact support.", "wordpress-seo" ),
				"Yoast SEO"
			);
	}
};

// Success keys the backend may send. Used to gate success feedback so an
// unrecognized key doesn't fall through to `messageFor`'s generic error string.
const SUCCESS_MESSAGE_KEYS = new Set( [ "connect_success", "update_success", "disconnect_success", "verify_success" ] );

/**
 * Formats the rate-limit message in minutes or hours, with the correct
 * singular/plural form. Sub-minute values round up to one minute.
 *
 * @param {number} seconds The retry-after value in seconds.
 * @returns {string} The localised message.
 */
const formatRateLimitedMessage = ( seconds ) => {
	const minutes = Math.ceil( seconds / 60 );
	if ( minutes >= 60 ) {
		const hours = Math.ceil( seconds / 3600 );
		return sprintf(
			/* translators: %1$s expands to MyYoast. %2$d is a number of hours. */
			_n( "%1$s has had a lot of connection attempts from this site or network. Please wait about %2$d hour and try again.", "%1$s has had a lot of connection attempts from this site or network. Please wait about %2$d hours and try again.", hours, "wordpress-seo" ),
			"MyYoast",
			hours
		);
	}
	return sprintf(
		/* translators: %1$s expands to MyYoast. %2$d is a number of minutes. */
		_n( "%1$s has had a lot of connection attempts from this site or network. Please wait about %2$d minute and try again.", "%1$s has had a lot of connection attempts from this site or network. Please wait about %2$d minutes and try again.", minutes, "wordpress-seo" ),
		"MyYoast",
		minutes
	);
};

const ACTION_DISPATCHERS = {
	refreshStatus: "refreshMyyoastConnectionStatus",
	connect: "connectMyyoastConnection",
	update: "updateMyyoastConnection",
	disconnect: "disconnectMyyoastConnection",
};

// Sentinel returned by runAction when another action is already in flight. Not a
// real backend failure — the action was deliberately dropped, so callers ignore
// it rather than surfacing it as an error.
const ACTION_IN_FLIGHT = "action_in_flight";

/**
 * Resolves the user-facing message for a given error code.
 *
 * @param {string} code The backend error code.
 * @param {Object} [details] Extra detail from the backend payload.
 * @returns {string} The translated message.
 */
const resolveErrorMessage = ( code, details ) => {
	if ( code === "rate_limited" ) {
		const seconds = Number( details?.retry_after_seconds );
		if ( Number.isFinite( seconds ) && seconds > 0 ) {
			return formatRateLimitedMessage( seconds );
		}
	}
	return messageFor( code );
};

/**
 * Runs a MyYoast management action: dispatches the slice action and, unless
 * silent, surfaces the outcome as a toast.
 *
 * @param {string} actionName The action (refreshStatus/connect/update/disconnect).
 * @param {Object} [body] The request body.
 * @param {Object} [options] Options.
 * @param {boolean} [options.silent] When true, suppress feedback.
 * @param {function} [options.onFeedback] Receives `{ variant, message }` to show as a toast.
 * @returns {Promise<Object>} The slice action's result.
 */
// eslint-disable-next-line complexity
const runAction = async( actionName, body, options ) => {
	// Serialize actions: they all mutate the same server-side registration, so a
	// second action started while one is in flight (e.g. the mount-time status
	// refresh overlapping a user click) would race on the shared status. Ignore it.
	if ( wpSelect( MYYOAST_STORE_NAME ).selectMyyoastConnectionActionInFlight() ) {
		return { ok: false, errorCode: ACTION_IN_FLIGHT };
	}
	const store = dispatch( MYYOAST_STORE_NAME );
	const result = await store[ ACTION_DISPATCHERS[ actionName ] ]( body );

	if ( options?.silent ) {
		return result;
	}

	if ( result.ok && SUCCESS_MESSAGE_KEYS.has( result.messageKey ) ) {
		options?.onFeedback?.( { variant: "success", message: messageFor( result.messageKey ) } );
	} else if ( ! result.ok ) {
		const message = resolveErrorMessage( result.errorCode, result.details );
		store.setMyyoastActionError( { actionName, errorCode: result.errorCode, message } );
		options?.onFeedback?.( { variant: "error", message } );
	}

	return result;
};

/**
 * Starts the verify-site flow: asks the backend for an authorization URL and
 * navigates the browser there. The backend resolves which registered redirect
 * URI to use. Errors surface as a toast.
 *
 * The current page is passed as the return URL so the OAuth callback sends the
 * user back to the integrations page. The backend validates it and ignores it
 * when off-site or invalid.
 *
 * @param {function} onFeedback Receives `{ variant, message }` to show as a toast.
 * @returns {Promise<boolean>} True once a redirect has been kicked off (the page
 *                             is navigating away); false when we stay on the page.
 */
const runAuthorize = async( onFeedback ) => {
	if ( wpSelect( MYYOAST_STORE_NAME ).selectMyyoastConnectionActionInFlight() ) {
		return false;
	}
	const store = dispatch( MYYOAST_STORE_NAME );
	const result = await store.authorizeMyyoastSite( { returnUrl: window.location.href } );

	if ( result.ok && result.authorizeUrl ) {
		window.location.assign( result.authorizeUrl );
		// The navigation is async — the page keeps rendering until MyYoast loads.
		// Report that a redirect started so callers don't restore in-page state.
		return true;
	}

	const message = resolveErrorMessage( result.errorCode, result.details );
	onFeedback?.( { variant: "error", message } );
	return false;
};

/**
 * The footer status line of the card. Mirrors the three registered states from
 * the design: connected (green check), connection lost (red error icon, URL no
 * longer matches), and verification needed (amber warning icon, a connected
 * site still needs an authorization-code flow). Not rendered when the site is
 * not registered — the footer shows the connect button in that case instead.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.connectionLost Whether the registered URL no longer matches.
 * @param {boolean} props.verificationNeeded Whether a connected site still needs verification.
 * @returns {JSX.Element} The status line.
 */
const StatusFooter = ( { connectionLost, verificationNeeded } ) => {
	const svgAriaProps = useSvgAria();
	const tooltipId = `myyoast-verification-${ useId() }`;
	const iconClass = "yst-h-5 yst-w-5 yst-flex-shrink-0";

	if ( connectionLost ) {
		return (
			<p className="yst-flex yst-items-center yst-justify-between yst-text-slate-700 yst-font-medium">
				{ __( "Site connection lost", "wordpress-seo" ) }
				<ExclamationCircleIcon className={ `${ iconClass } yst-text-red-500` } { ...svgAriaProps } />
			</p>
		);
	}

	if ( verificationNeeded ) {
		return (
			<p className="yst-flex yst-items-center yst-justify-between yst-text-slate-700 yst-font-medium">
				{ __( "Site connected", "wordpress-seo" ) }
				<TooltipContainer>
					<TooltipTrigger as="span" ariaDescribedby={ tooltipId } className="yst-inline-flex">
						<ExclamationIcon className={ `${ iconClass } yst-text-amber-500` } { ...svgAriaProps } />
					</TooltipTrigger>
					<TooltipWithContext id={ tooltipId } className="yst-max-w-48 yst-z-50 yst-text-center" position="top-left">
						{ sprintf(
							/* translators: %1$s expands to MyYoast. */
							__( "Sign in to %1$s to finish setting up this connection so everything works as expected.", "wordpress-seo" ),
							"MyYoast"
						) }
					</TooltipWithContext>
				</TooltipContainer>
			</p>
		);
	}

	return (
		<p className="yst-flex yst-items-center yst-justify-between yst-text-slate-700 yst-font-medium">
			{ __( "Site connected", "wordpress-seo" ) }
			<CheckIcon className={ `${ iconClass } yst-text-green-400` } { ...svgAriaProps } />
		</p>
	);
};

/**
 * The MyYoast connection card on the integrations page.
 *
 * @returns {JSX.Element} The card element.
 */
// eslint-disable-next-line complexity
export const MyyoastIntegration = () => {
	const status = useSelect( select => select( MYYOAST_STORE_NAME ).selectMyyoastConnectionStatus(), [] );
	const actionInFlight = useSelect( select => select( MYYOAST_STORE_NAME ).selectMyyoastConnectionActionInFlight(), [] );
	const pendingCallbackOutcome = useSelect( select => select( MYYOAST_STORE_NAME ).selectMyyoastConnectionPendingCallbackOutcome(), [] );
	// UTM/tracking params localized by the page; appended to outbound links so
	// they carry the same attribution as the other integration cards' links.
	const linkParams = useSelect( select => select( MYYOAST_STORE_NAME ).selectMyyoastConnectionLinkParams(), [] );
	const learnMoreLink = addQueryArgs( LEARN_MORE_LINK, linkParams );
	// The OAuth flow outcome (connect/verify/disconnect/refresh and the callback
	// return) surfaces as a transient toast. Each new outcome carries a fresh id
	// so the toast remounts and re-animates even when the message is unchanged.
	const [ feedback, setFeedback ] = useState( null );
	const feedbackId = useRef( 0 );
	const showFeedback = useCallback( ( next ) => {
		feedbackId.current += 1;
		setFeedback( { ...next, id: feedbackId.current } );
	}, [] );
	const dismissFeedback = useCallback( () => setFeedback( null ), [] );
	// True only while the connect → authorize auto-flow is running: registration
	// succeeds (status becomes registered-but-unverified) before we redirect to
	// MyYoast, and we don't want to flash the "Verification needed" notice for
	// that gap. Scoped to this flow so a deliberate verify click still shows it.
	const [ isConnecting, setIsConnecting ] = useState( false );
	const [ isDisconnectOpen, , , openDisconnect, closeDisconnect ] = useToggleState( false );

	// Auto-fired status refresh on mount: confirms with MyYoast that the stored
	// registration is still valid. Errors are silent; the response refreshes
	// the local status, so Registration_Not_Found clears state and the card
	// re-renders as "not connected".
	useEffect( () => {
		if ( status.isRegistered ) {
			runAction( "refreshStatus", null, { silent: true } );
		}
	}, [] );

	// Surfaces the one-shot outcome stashed by the OAuth callback handler
	// (success or error) as a toast. The transient is consumed server-side on
	// read, so after we've shown it we clear it from the slice to avoid
	// re-firing on subsequent renders.
	useEffect( () => {
		if ( ! pendingCallbackOutcome ) {
			return;
		}
		const { kind, key } = pendingCallbackOutcome;
		showFeedback( { variant: kind === "success" ? "success" : "error", message: messageFor( key ) } );
		dispatch( MYYOAST_STORE_NAME ).clearMyyoastCallbackOutcome();
	}, [ pendingCallbackOutcome, showFeedback ] );

	// Connecting only registers the site as an OAuth client; the connection is
	// not usable until one user completes an authorization-code grant. So on a
	// successful registration we continue straight into that flow, sending the
	// user to MyYoast to sign in rather than leaving them on the unverified
	// "Verification needed" state. A failed registration just shows its error.
	const handleConnect = useCallback( async() => {
		// Mark the combined flow so the registered-but-unverified gap between
		// registration and the redirect doesn't flash the verification notice.
		setIsConnecting( true );
		// Register silently: on success we redirect to MyYoast immediately, so a
		// transient "connected" message would only flash before the page leaves.
		// A failure still needs to be shown, so surface only that.
		const result = await runAction( "connect", null, { silent: true } );
		if ( ! result.ok ) {
			// Another action was already running (e.g. a double-click before the
			// button re-rendered as disabled). The first action stays in flight, so
			// drop this one silently rather than flashing a spurious error.
			if ( result.errorCode === ACTION_IN_FLIGHT ) {
				setIsConnecting( false );
				return;
			}
			const message = resolveErrorMessage( result.errorCode, result.details );
			showFeedback( { variant: "error", message } );
			setIsConnecting( false );
			return;
		}
		// Registration succeeded; continue straight into the authorization-code
		// flow. The backend resolves which registered redirect URI to use.
		const redirecting = await runAuthorize( showFeedback );
		// Only clear when we're staying on the page: `window.location.assign` is
		// async, so the page keeps rendering while MyYoast loads. Clearing now
		// would flash the verification notice during that tail.
		if ( ! redirecting ) {
			setIsConnecting( false );
		}
	}, [ showFeedback ] );
	const handleReconnect = useCallback( () => runAction( "update", null, { onFeedback: showFeedback } ), [ showFeedback ] );
	const handleDisconnectConfirm = useCallback( () => {
		closeDisconnect();
		runAction( "disconnect", null, { onFeedback: showFeedback } );
	}, [ showFeedback ] );

	const redirectUris = Array.isArray( status.redirectUris ) ? status.redirectUris : [];
	// "Connection lost" takes precedence over "verification needed": once the
	// registered URL no longer matches, reconnecting is the only fix and any
	// unverified-site notice would be premature.
	const connectionLost = status.isRegistered && status.redirectUrisMatch === false;
	// Show a single verification notice for the first unverified site, even when
	// several are connected — verifying them all clears it. Suppressed while the
	// connection is lost.
	const firstUnverified = connectionLost ? null : redirectUris.find( ( entry ) => ! entry.isVerified ) ?? null;
	// Suppressed during the connect → authorize auto-flow: registration leaves the
	// site registered-but-unverified for the moment before the redirect fires.
	const verificationNeeded = Boolean( firstUnverified ) && ! isConnecting;

	const handleVerify = useCallback( () => {
		if ( firstUnverified ) {
			runAuthorize( showFeedback );
		}
	}, [ firstUnverified, showFeedback ] );

	return (
		<>
			{ /* The purple outline flags the card as a call to action; once connected it's dropped so the card blends in with the others. */ }
			<Card className={ status.isRegistered ? "" : "yst-border-2 yst-border-primary-200" }>
				<Card.Header>
					<MyYoastLogo className="yst-h-8 yst-w-auto" />
				</Card.Header>
				<Card.Content>
					<div className="yst-flex yst-flex-col yst-gap-4">
						<h4 className="yst-text-base yst-font-medium yst-text-[#111827] yst-leading-tight">
							{ safeCreateInterpolateElement(
								sprintf(
									/* translators: %1$s expands to Yoast. %2$s expands to a bold open tag.
									%3$s expands to MyYoast. %4$s expands to a bold close tag. */
									__( "Unlock more from %1$s with %2$s%3$s%4$s", "wordpress-seo" ),
									"Yoast",
									"<strong>",
									"MyYoast",
									"</strong>"
								),
								{ strong: <strong /> }
							) }
						</h4>
						<p>
							{ sprintf(
								/* translators: %1$s expands to MyYoast. %2$s expands to Yoast AI. */
								__( "Connect your site to %1$s so %2$s works even when your site is offline, behind a firewall, or with the REST API disabled.", "wordpress-seo" ),
								"MyYoast",
								"Yoast AI"
							) }
						</p>

						<Link
							href={ learnMoreLink }
							className="yst-flex yst-items-center yst-no-underline yst-font-medium"
							target="_blank"
						>
							{ __( "Learn more", "wordpress-seo" ) }
							<span className="yst-sr-only">
								{
									/* translators: Hidden accessibility text. */
									__( "(Opens in a new browser tab)", "wordpress-seo" )
								}
							</span>
							<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ms-1 yst-icon-rtl" />
						</Link>

						{ ! status.isProvisioned && (
							<Alert variant="warning">
								{ sprintf(
									/* translators: %1$s expands to MyYoast. %2$s expands to Yoast SEO. */
									__( "%1$s connection is not configured on this build of %2$s. Site features that depend on it are unavailable.", "wordpress-seo" ),
									"MyYoast",
									"Yoast SEO"
								) }
							</Alert>
						) }

						{ status.isProvisioned && status.isRegistered && (
							<div className="yst-flex yst-flex-col yst-gap-3">
								<div>
									<h5 className="yst-font-medium yst-text-slate-900">
										{ __( "Site connection", "wordpress-seo" ) }
									</h5>
									{ redirectUris.length > 0 && (
										<ul className="yst-mt-1 yst-text-sm yst-text-slate-600 yst-list-none yst-space-y-1">
											{ redirectUris.map( ( entry ) => (
												<li key={ entry.uri }>{ entry.origin }</li>
											) ) }
										</ul>
									) }
								</div>
								<Button
									type="button"
									variant="tertiary"
									className="yst-self-start yst--mx-3 yst-text-red-600"
									onClick={ openDisconnect }
									disabled={ actionInFlight !== null }
									isLoading={ actionInFlight === "disconnect" }
								>
									{ __( "Disconnect", "wordpress-seo" ) }
								</Button>

								{ connectionLost && (
									<Alert variant="error">
										<div className="yst-space-y-2">
											<p className="yst-font-medium">{ __( "Connection lost", "wordpress-seo" ) }</p>
											<p>{ sprintf(
												/* translators: %1$s expands to MyYoast. */
												__( "Your site's URL changed since the connection with %1$s was made. Please reconnect.", "wordpress-seo" ),
												"MyYoast"
											) }</p>
											<Button
												type="button"
												size="small"
												variant="tertiary"
												className="yst--mx-3"
												onClick={ handleReconnect }
												disabled={ actionInFlight !== null }
												isLoading={ actionInFlight === "update" }
											>
												{ __( "Reconnect", "wordpress-seo" ) }
											</Button>
										</div>
									</Alert>
								) }

								{ verificationNeeded && (
									<Alert variant="warning">
										<div className="yst-space-y-2">
											<p className="yst-font-medium">{ __( "Verification needed", "wordpress-seo" ) }</p>
											<p>{ sprintf(
												/* translators: %1$s expands to MyYoast. */
												__( "Sign in to %1$s to finish setting up this connection.", "wordpress-seo" ),
												"MyYoast"
											) }</p>
											<Button
												type="button"
												size="small"
												variant="tertiary"
												className="yst--mx-3"
												onClick={ handleVerify }
												disabled={ actionInFlight !== null }
												isLoading={ actionInFlight === "authorize" }
											>
												{ sprintf(
												/* translators: %1$s expands to MyYoast. */
													__( "Sign in to %1$s", "wordpress-seo" ),
													"MyYoast"
												) }
											</Button>
										</div>
									</Alert>
								) }
							</div>
						) }
					</div>
				</Card.Content>
				{ status.isProvisioned && (
					<Card.Footer>
						{ status.isRegistered ? (
							<StatusFooter connectionLost={ connectionLost } verificationNeeded={ verificationNeeded } />
						) : (
							<Button
								type="button"
								variant="primary"
								onClick={ handleConnect }
								disabled={ actionInFlight !== null }
								isLoading={ actionInFlight === "connect" }
								className="yst-w-full"
							>
								{ __( "Connect your site", "wordpress-seo" ) }
							</Button>
						) }
					</Card.Footer>
				) }
			</Card>

			<MyyoastConnectionDisconnectModal
				isOpen={ isDisconnectOpen }
				onClose={ closeDisconnect }
				onConfirm={ handleDisconnectConfirm }
			/>

			<Notifications position="bottom-left">
				{ feedback && (
					<Notifications.Notification
						// Keyed on the per-outcome id so a new outcome remounts the toast and re-animates.
						key={ feedback.id }
						id={ `myyoast-feedback-${ feedback.id }` }
						variant={ feedback.variant }
						description={ feedback.message }
						onDismiss={ dismissFeedback }
						autoDismiss={ feedback.variant === "success" ? 5000 : null }
						dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) }
					/>
				) }
			</Notifications>
		</>
	);
};
