/* External dependencies */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";


import { FieldGroup } from "@yoast/components";
/* Internal dependencies */
import WincherSEOPerformanceLoading from "./modals/WincherSEOPerformanceLoading";
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import WincherKeyphrasesTable from "../containers/WincherKeyphrasesTable";
import WincherExplanation from "./modals/WincherExplanation";
import WincherNoKeyphraseSet from "./modals/WincherNoKeyphraseSet";

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
 * Gets a user message based on the passed props' values.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The user message.
 */
export function getUserMessage( props ) {
	const {
		isSuccess,
		response,
		requestHasData,
	} = props;

	if ( ! isSuccess && hasError( response ) ) {
		return <WincherRequestFailed />;
	}

	if ( ! requestHasData ) {
		return <p>{ __( "Sorry, there's no data available for that keyphrase.", "wordpress-seo" ) }</p>;
	}
}

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
		hasPendingChartRequest,
	} = props;

	return (
		<Fragment>
			{ hasNoKeyphrase && <WincherNoKeyphraseSet /> }

			{ ! hasNoKeyphrase && (
				<Fragment>
					{ isNewlyAuthenticated && <WincherConnectedAlert /> }

					<FieldGroup
						label={ __( "SEO performance", "wordpress-seo" ) }
						linkTo={ "https://google.com" }
						linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
					/>
					<WincherExplanation />

					{ hasPendingChartRequest && <WincherCurrentlyTrackingAlert /> }

					{ getUserMessage( props ) }

					<p>{ __( "You can enable / disable tracking the SEO performance for each keyphrase below.", "wordpress-seo" ) }</p>

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
	hasPendingChartRequest: PropTypes.bool,
};

WincherSEOPerformanceModalContent.defaultProps = {
	limit: 10,
	requestLimitReached: false,
	hasNoKeyphrase: false,
	isNewlyAuthenticated: false,
	hasPendingChartRequest: false,
};
