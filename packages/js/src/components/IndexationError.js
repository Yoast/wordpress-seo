import PropTypes from "prop-types";
import styled from "styled-components";
import { Alert } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import { RequestError } from "../errors/RequestError";

const AlertParagraph = styled.p`
	margin: 0;
	margin-bottom: 13px;
`;

/**
 * Generates the first paragraph of the error message to show when indexing failed.
 *
 * The error message varies based on whether WordPress SEO Premium
 * has a valid, activated subscription or not.
 *
 * @param {boolean} isPremium Whether WordPress SEO Premium is currently active.
 * @param {boolean} hasValidPremiumSubscription Whether WordPress SEO Premium currently has a valid subscription.
 * @param {string} subscriptionActivationLink The subscription activation link to show when no valid subscription is available.
 *
 * @returns {string} The indexing error as an HTML string.
 */
function generateFirstParagraph( isPremium, hasValidPremiumSubscription, subscriptionActivationLink ) {
	let message = __(
		"Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
		"Please click the button again to re-start the process.",
		"wordpress-seo"
	);

	if ( isPremium ) {
		if ( hasValidPremiumSubscription ) {
			message += __( " If the problem persists, please contact support.", "wordpress-seo" );
		} else {
			message = sprintf(
				__(
					"Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
					"Please make sure to activate your subscription in MyYoast by completing %1$sthese steps%2$s.",
					"wordpress-seo"
				),
				// Translators: %1$s expands to an opening anchor tag for a link leading to the Premium installation page,
				// %2$s expands to a closing anchor tag.
				"<a href='" + subscriptionActivationLink + "'>",
				"</a>"
			);
		}
	}

	return message;
}

/**
 * Generates the second paragraph of the error message to show when indexing failed.
 *
 * The error message varies based on whether WordPress SEO Premium
 * has a valid, activated subscription or not.
 *
 * @param {boolean} isPremium Whether WordPress SEO Premium is currently active.
 * @param {boolean} hasValidPremiumSubscription Whether the user has a valid WordPress SEO Premium subscription.
 * @param {string} supportLink The link for WordPress SEO users to show in the error.
 * @param {string} premiumSupportLink The link for WordPress SEO Premium users to show in the error.
 *
 * @returns {string} The second paragraph of the error message as an HTML string.
 */
function generateSecondParagraph( isPremium, hasValidPremiumSubscription, supportLink, premiumSupportLink ) {
	if ( isPremium && hasValidPremiumSubscription ) {
		return sprintf(
			__(
				"These are the technical details for the error. Include them in %1$syour email to our support team%2$s, " +
				"it can help them troubleshoot the problem.",
				"wordpress-seo"
			),
			// Translators: %1$s expands to an opening anchor tag for a link leading to the Premium installation page,
			// %2$s expands to a closing anchor tag.
			"<a href='" + supportLink + "'>",
			"</a>"
		);
	}

	return sprintf(
		__(
			"Below are the technical details for the error. " +
			"They can be useful to include %1$swhen reporting a bug to us%2$s.",
			"wordpress-seo"
		),
		// Translators: %1$s expands to an opening anchor tag for a link leading to the Premium installation page,
		// %2$s expands to a closing anchor tag.
		"<a href='" + premiumSupportLink + "'>",
		"</a>"
	);
}

/**
 * Shows a value for in the error details.
 *
 * If the value is `undefined`, nothing is shown.
 *
 * @param {string} title The title of the thing.
 * @param {any} value The value to show.
 *
 * @returns {JSX.Element|null} The error line component, or `null` if the value is `undefined`.
 */
function ErrorLine( { title, value } ) {
	if ( typeof value === "undefined" ) {
		return null;
	}
	return <p>
		<strong>{ title }</strong><br />
		{ value }
	</p>;
}

ErrorLine.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.any,
};

/**
 * Shows a detailed error report of the given error.
 *
 * @param {Error|RequestError} error The error to show.
 *
 * @returns {JSX.Element} The error details component.
 */
function ErrorDetails( { error } ) {
	return <div>
		<ErrorLine title={ "Request URL" } value={ error.url } />
		<ErrorLine title={ "Request method" } value={ error.method } />
		<ErrorLine title={ "Status code" } value={ error.statusCode } />
		<ErrorLine title={ "Message" } value={ error.message } />
	</div>;
}

ErrorDetails.propTypes = {
	error: PropTypes.oneOfType( [
		PropTypes.instanceOf( Error ),
		PropTypes.instanceOf( RequestError ),
	] ).isRequired,
};

/**
 * An error that should be shown when indexation has failed.
 *
 * @param {boolean} isPremium Whether WordPress SEO Premium is currently active.
 * @param {boolean} hasValidPremiumSubscription Whether WordPress SEO Premium currently has a valid subscription.
 * @param {string} subscriptionActivationLink The subscription activation link to show when no valid subscription is available.
 * @param {string} supportLink The link for WordPress SEO users to show in the error.
 * @param {string} premiumSupportLink The link for WordPress SEO Premium users to show in the error.
 * @param {Error|RequestError} error The error to show.
 *
 * @returns {JSX.Element} The indexation error component.
 */
export default function IndexationError( {
	isPremium,
	hasValidPremiumSubscription,
	subscriptionActivationLink,
	supportLink,
	premiumSupportLink,
	error
} ) {
	const paragraph1 = { __html: generateFirstParagraph( isPremium, hasValidPremiumSubscription, subscriptionActivationLink ) };
	const paragraph2 = { __html: generateSecondParagraph( isPremium, hasValidPremiumSubscription, supportLink, premiumSupportLink ) };

	return <Alert type={ "error" }>
		<AlertParagraph dangerouslySetInnerHTML={ paragraph1 } />
		<AlertParagraph dangerouslySetInnerHTML={ paragraph2 } />
		<details>
			<summary>{ __( "Error details (click to show/hide)", "wordpress-seo" ) }</summary>
			<ErrorDetails error={ error } />
		</details>
	</Alert>;
}

IndexationError.propTypes = {
	isPremium: PropTypes.bool.isRequired,
	hasValidPremiumSubscription: PropTypes.bool.isRequired,
	subscriptionActivationLink: PropTypes.string.isRequired,
	supportLink: PropTypes.string.isRequired,
	premiumSupportLink: PropTypes.string.isRequired,
	error: PropTypes.oneOfType( [
		PropTypes.instanceOf( Error ),
		PropTypes.instanceOf( RequestError ),
	] ).isRequired,
};
