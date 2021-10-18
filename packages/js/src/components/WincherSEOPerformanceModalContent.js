/* global wpseoAdminL10n, wpseoAdminGlobalL10n */

/* External dependencies */
import { Fragment, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";
import styled from "styled-components";

/* Yoast dependencies */
import { Button, FieldGroup } from "@yoast/components";

/* Internal dependencies */
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import WincherKeyphrasesTable from "../containers/WincherKeyphrasesTable";
import WincherExplanation from "./modals/WincherExplanation";
import WincherAutoTrackingEnabledAlert from "./modals/WincherAutoTrackingEnabledAlert";
import LoginPopup from "../helpers/loginPopup";
import { authenticate, handleAPIResponse } from "../helpers/wincherEndpoints";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";

/**
 * Determines whether the error property is present in the passed response object.
 *
 * @param {Object} response The response object.
 *
 * @returns {boolean} Whether or not the error property is present.
 */
export function hasError( response ) {
	return ! isEmpty( response ) && "error" in response;
}

/**
 * Gets the proper error message component.
 *
 * @param {Object} response The response object to base the error message on.
 *
 * @returns {wp.Element} The error message component.
 */
const GetErrorMessage = ( { response } ) => {
	if ( response.status === 400 && response.data && response.data.canTrack === false ) {
		return <WincherLimitReached
			limit={ response.data.limit }
		/>;
	}

	return <WincherRequestFailed />;
};

GetErrorMessage.propTypes = {
	response: PropTypes.object.isRequired,
};

/**
 * Gets a user message based on the passed props' values.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The user message.
 */
const GetUserMessage = ( { isSuccess, response, hasPendingChartRequest, hasTrackedKeyphrases } ) => {
	if ( isEmpty( response ) ) {
		return null;
	}

	if ( ! isSuccess && hasError( response ) ) {
		return <GetErrorMessage response={ response } />;
	}

	if ( hasTrackedKeyphrases && hasPendingChartRequest ) {
		return <WincherCurrentlyTrackingAlert />;
	}

	return null;
};

GetUserMessage.propTypes = {
	isSuccess: PropTypes.bool.isRequired,
	hasPendingChartRequest: PropTypes.bool.isRequired,
	hasTrackedKeyphrases: PropTypes.bool.isRequired,
	response: PropTypes.object,
};

GetUserMessage.defaultProps = {
	response: {},
};

let currentPopup = null;

/**
 * Get the tokens using the provided code after user has granted authorization.
 *
 * @param {Object} props The props.
 * @param {Object} data The message data.
 *
 * @returns {void}
 */
const performAuthenticationRequest = async( props, data ) => {
	const {
		onAuthentication,
		setRequestSucceeded,
		setRequestFailed,
	} = props;

	await handleAPIResponse(
		() => authenticate( data ),
		async( response ) => {
			onAuthentication( true, true );
			setRequestSucceeded( response );

			// Close the popup if it's been opened again by mistake.
			const popup = currentPopup.getPopup();

			if ( popup ) {
				popup.close();
			}
		},
		async( response ) => setRequestFailed( response )
	);
};

/**
 * Opens the popup window.
 *
 * @param {Object} props The props.
 *
 * @returns {void}
 */
const onLoginOpen = ( props ) => {
	currentPopup = new LoginPopup(
		wpseoAdminGlobalL10n[ "links.wincher.auth_url" ],
		{
			success: {
				type: "wincher:oauth:success",
				callback: ( data ) => performAuthenticationRequest( props, data ),
			},
			error: {
				type: "wincher:oauth:error",
				callback: () => props.onAuthentication( false, false ),
			},
		},
		{
			title: "Wincher_login",
			width: 500,
			height: 700,
		}
	);

	currentPopup.createPopup();
};

/**
 * Creates the Connect to Wincher button or displays the reconnect alert if something has gone wrong.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The connect button or reconnect alert.
 */
const ConnectToWincher = ( props ) => {
	if ( props.isLoggedIn ) {
		return null;
	}

	const onLoginCallback = useCallback( () => {
		onLoginOpen( props );
	}, [ onLoginOpen, props ] );

	if ( ! isEmpty( props.response ) && props.response.status === 404 ) {
		return <WincherReconnectAlert onReconnect={ onLoginCallback } />;
	}

	return <Button onClick={ onLoginCallback }>
		{ sprintf(
			/* translators: %s expands to Wincher */
			__( "Connect with %s", "wordpress-seo" ),
			"Wincher"
		) }
	</Button>;
};

ConnectToWincher.propTypes = {
	response: PropTypes.object,
	isLoggedIn: PropTypes.bool.isRequired,
};

ConnectToWincher.defaultProps = {
	response: {},
};

const ContentWrapper = styled.div`
	${ props => props.isDisabled && `
		opacity: .4;
		pointer-events: none;
		margin-top: 20px;
	`};
`;

/**
 * Renders the Wincher SEO Performance modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The Wincher SEO Performance modal content.
 */
export default function WincherSEOPerformanceModalContent( props ) {
	const {
		isNewlyAuthenticated,
		requestLimitReached,
		limit,
		shouldTrackAll,
		isLoggedIn,
	} = props;

	return (
		<Fragment>
			{ isNewlyAuthenticated && <WincherConnectedAlert /> }

			<FieldGroup
				label={ __( "SEO performance", "wordpress-seo" ) }
				linkTo={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }
				linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
			/>
			<WincherExplanation />

			<ConnectToWincher { ...props } />
			<GetUserMessage { ...props } />

			<ContentWrapper isDisabled={ ! isLoggedIn }>
				<p>{ __( "You can enable / disable tracking the SEO performance for each keyphrase below.", "wordpress-seo" ) }</p>

				{ isLoggedIn && shouldTrackAll && <WincherAutoTrackingEnabledAlert /> }

				{ requestLimitReached && <WincherLimitReached limit={ limit } /> }
				<WincherKeyphrasesTable />
			</ContentWrapper>
		</Fragment>
	);
}

WincherSEOPerformanceModalContent.propTypes = {
	limit: PropTypes.number,
	requestLimitReached: PropTypes.bool,
	hasNoKeyphrase: PropTypes.bool,
	isNewlyAuthenticated: PropTypes.bool,
	shouldTrackAll: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
	response: PropTypes.object,
};

WincherSEOPerformanceModalContent.defaultProps = {
	limit: 10,
	requestLimitReached: false,
	hasNoKeyphrase: false,
	isNewlyAuthenticated: false,
	shouldTrackAll: false,
	isLoggedIn: false,
	response: {},
};
