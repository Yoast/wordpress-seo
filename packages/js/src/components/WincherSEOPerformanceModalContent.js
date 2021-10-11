/* global wpseoAdminL10n */

/* External dependencies */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { FieldGroup } from "@yoast/components";

/* Internal dependencies */
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import WincherKeyphrasesTable from "../containers/WincherKeyphrasesTable";
import WincherExplanation from "./modals/WincherExplanation";
import WincherNoKeyphraseSet from "./modals/WincherNoKeyphraseSet";
import WincherAutoTrackingEnabledAlert from "./modals/WincherAutoTrackingEnabledAlert";

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

/**
 * Renders the Wincher SEO Performance modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The Wincher SEO Performance modal content.
 */
export default function WincherSEOPerformanceModalContent( props ) {
	const {
		hasNoKeyphrase,
		isNewlyAuthenticated,
		requestLimitReached,
		limit,
		shouldTrackAll,
		isLoggedIn,
	} = props;

	return (
		<Fragment>
			{ hasNoKeyphrase && <WincherNoKeyphraseSet /> }

			{ ! hasNoKeyphrase && (
				<Fragment>
					{ isNewlyAuthenticated && <WincherConnectedAlert /> }

					<FieldGroup
						label={ __( "SEO performance", "wordpress-seo" ) }
						linkTo={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }
						linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
					/>
					<WincherExplanation />

					<GetUserMessage { ...props } />

					<p>{ __( "You can enable / disable tracking the SEO performance for each keyphrase below.", "wordpress-seo" ) }</p>

					{ isLoggedIn && shouldTrackAll && <WincherAutoTrackingEnabledAlert /> }

					{ requestLimitReached && <WincherLimitReached limit={ limit } /> }
					<WincherKeyphrasesTable />
				</Fragment>
			) }
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
};

WincherSEOPerformanceModalContent.defaultProps = {
	limit: 10,
	requestLimitReached: false,
	hasNoKeyphrase: false,
	isNewlyAuthenticated: false,
	shouldTrackAll: false,
	isLoggedIn: false,
};
