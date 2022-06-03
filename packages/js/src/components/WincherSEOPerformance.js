/* global wpseoAdminL10n */

/* External dependencies */
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";
import styled from "styled-components";

/* Yoast dependencies */
import { NewButton, HelpIcon } from "@yoast/components";

/* Internal dependencies */
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import WincherKeyphrasesTable from "../containers/WincherKeyphrasesTable";
import WincherExplanation from "./modals/WincherExplanation";
import WincherNoKeyphraseSet from "./modals/WincherNoKeyphraseSet";
import WincherAutoTrackingEnabledAlert from "./modals/WincherAutoTrackingEnabledAlert";
import LoginPopup from "../helpers/loginPopup";
import { authenticate, getAuthorizationUrl } from "../helpers/wincherEndpoints";
import { handleAPIResponse } from "../helpers/api";
import WincherReconnectAlert from "./modals/WincherReconnectAlert";
import WincherNoPermalinkAlert from "./modals/WincherNoPermalinkAlert";

/**
 * Gets the proper error message component.
 *
 * @param {Object} response The response object to base the error message on.
 * @param {Function} onLogin The onLogin callback used when reconnecting.
 *
 * @returns {wp.Element} The error message component.
 */
const GetErrorMessage = ( { response, onLogin } ) => {
	if ( response.status === 403 || response.status === 404 ) {
		return <WincherReconnectAlert onReconnect={ onLogin } />;
	}

	return <WincherRequestFailed />;
};

GetErrorMessage.propTypes = {
	response: PropTypes.object.isRequired,
	onLogin: PropTypes.func.isRequired,
};

/**
 * Gets a user message based on the passed props' values.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The user message.
 */
const GetUserMessage = ( {
	isSuccess,
	response,
	allKeyphrasesMissRanking,
	onLogin,
	keyphraseLimitReached,
	limit,
} ) => {
	if ( keyphraseLimitReached ) {
		return <WincherLimitReached limit={ limit } />;
	}

	if ( ! isEmpty( response ) && ! isSuccess ) {
		return <GetErrorMessage response={ response } onLogin={ onLogin } />;
	}

	if ( allKeyphrasesMissRanking ) {
		return <WincherCurrentlyTrackingAlert />;
	}

	return null;
};

GetUserMessage.propTypes = {
	isSuccess: PropTypes.bool.isRequired,
	allKeyphrasesMissRanking: PropTypes.bool.isRequired,
	response: PropTypes.object,
	onLogin: PropTypes.func.isRequired,
	keyphraseLimitReached: PropTypes.bool.isRequired,
	limit: PropTypes.number.isRequired,
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
			onAuthentication( true, true, data.websiteId.toString() );
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
const onLoginOpen = async( props ) => {
	if ( currentPopup && ! currentPopup.isClosed() ) {
		currentPopup.focus();
		return;
	}

	const { url } = await getAuthorizationUrl();

	currentPopup = new LoginPopup(
		url,
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
 * Creates the Connect to Wincher button.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The connect button or reconnect alert.
 */
const ConnectToWincher = ( props ) => {
	if ( props.isLoggedIn ) {
		return null;
	}

	return <p>
		<NewButton onClick={ props.onLogin } variant="primary">
			{ sprintf(
			/* translators: %s expands to Wincher */
				__( "Connect with %s", "wordpress-seo" ),
				"Wincher"
			) }
		</NewButton>
	</p>;
};

ConnectToWincher.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	onLogin: PropTypes.func.isRequired,
};

// We need this wrapper to get consistent paragraph margins in both Elementor and Gutenberg.
const Wrapper = styled.div`
	p {
		margin: 1em 0;
	}
`;

const TableWrapper = styled.div`
	${ props => props.isDisabled && `
		opacity: .5;
		pointer-events: none;
	`};
`;

const Title = styled.div`
	font-weight: var(--yoast-font-weight-bold);
	color: var(--yoast-color-label);
	font-size: var(--yoast-font-size-default);
`;

/**
 * Creates the table content.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void|wp.Element} The table content.
 */
const TableContent = ( props ) => {
	const {
		isLoggedIn,
		keyphrases,
		shouldTrackAll,
		permalink,
	} = props;

	if ( ! permalink && isLoggedIn ) {
		return <WincherNoPermalinkAlert />;
	}

	if ( keyphrases.length === 0 ) {
		return <WincherNoKeyphraseSet />;
	}

	return <TableWrapper isDisabled={ ! isLoggedIn }>
		<p>{ __( "You can enable / disable tracking the SEO performance for each keyphrase below.", "wordpress-seo" ) }</p>

		{ isLoggedIn && shouldTrackAll && <WincherAutoTrackingEnabledAlert /> }

		<WincherKeyphrasesTable />
	</TableWrapper>;
};

TableContent.propTypes = {
	keyphrases: PropTypes.array.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	shouldTrackAll: PropTypes.bool.isRequired,
	permalink: PropTypes.string.isRequired,
};

/**
 * Renders the Wincher SEO Performance modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The Wincher SEO Performance modal content.
 */
export default function WincherSEOPerformance( props ) {
	const {
		isNewlyAuthenticated,
		isLoggedIn,
	} = props;

	const onLoginCallback = useCallback( () => {
		onLoginOpen( props );
	}, [ onLoginOpen, props ] );

	return (
		<Wrapper>
			{ isNewlyAuthenticated && <WincherConnectedAlert /> }

			<Title>
				{ __( "SEO performance", "wordpress-seo" ) }
				<HelpIcon
					linkTo={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }
					linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
				/>
			</Title>

			<WincherExplanation />

			<ConnectToWincher isLoggedIn={ isLoggedIn } onLogin={ onLoginCallback } />
			<GetUserMessage { ...props } onLogin={ onLoginCallback } />
			<TableContent { ...props } />
		</Wrapper>
	);
}

WincherSEOPerformance.propTypes = {
	isLoggedIn: PropTypes.bool,
	isNewlyAuthenticated: PropTypes.bool,
	keyphrases: PropTypes.array,
	response: PropTypes.object,
	shouldTrackAll: PropTypes.bool,
	permalink: PropTypes.string,
};

WincherSEOPerformance.defaultProps = {
	isLoggedIn: false,
	isNewlyAuthenticated: false,
	keyphrases: [],
	response: {},
	shouldTrackAll: false,
	permalink: "",
};
