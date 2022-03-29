import { useCallback, useState, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmail } from "@wordpress/url";
import PropTypes from "prop-types";

import { addLinkToString } from "../../../../helpers/stringHelpers";
import TextInput from "../../base/text-input";

/**
 * A function to request a sign up to the newsletter.
 *
 * @param {string} email The email to signup to the newsletter.
 *
 * @returns {Object} The request's response.
 */
async function postSignUp( email ) {
	const response = await fetch( "https://my.yoast.com/api/Mailing-list/subscribe", {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
		body: JSON.stringify(
			{
				customerDetails: {
					firstName: "",
					email,
				},
				list: "Yoast newsletter",
			}
		),
	} );
	return response.json();
}

const genericErrorFeedback = __( "Oops! Something went wrong. Check your email address and try again.", "wordpress-seo" );
const invalidEmailFeedback = __( "That is not a valid email address. Check your email address and try again.", "wordpress-seo" );
const alreadySubscribedFeedback = __( "That email address has already been subscribed.", "wordpress-seo" );
const subscribedFeedback = __(
	"Thanks! Please click the link in the email we just sent you to confirm your newsletter subscription.",
	"wordpress-seo"
);

/**
 * The newsletter signup section.
 *
 * @param {string} gdprLink Shortlink to the Yoast privacy policy.
 *
 * @returns {WPElement} A newslettersignup element.
 */
export function NewsletterSignup( { gdprLink } ) {
	const [ newsletterEmail, setNewsletterEmail ] = useState( "" );
	const [ signUpState, setSignUpState ] = useState( "waiting" );
	const [ emailFeedback, setEmailFeedback ] = useState( "" );

	const onSignUpClick = useCallback(
		async function() {
			if ( ! isEmail( newsletterEmail ) ) {
				setSignUpState( "error" );
				setEmailFeedback( invalidEmailFeedback );
				return;
			}
			setSignUpState( "loading" );
			const response = await postSignUp( newsletterEmail );
			if ( response.error ) {
				setSignUpState( "error" );
				setEmailFeedback( genericErrorFeedback );
			} else {
				setSignUpState( "success" );
				setEmailFeedback(
					response.status === "alreadySubscribed" ? alreadySubscribedFeedback : subscribedFeedback
				);
			}
		},
		[ newsletterEmail ]
	);

	return (
		<Fragment>
			<h4 className="yst-text-gray-900 yst-text-base yst-leading-6 yst-font-normal">
				{
					// translators: %s is replaced by "Yoast"
					sprintf( __( "%s newsletter", "wordpress-seo" ), "Yoast" )
				}
			</h4>
			<p className="yst-my-2">
				{
					sprintf(
						__(
							// translators: %1$s expands to "Yoast", %2$s expands to "Yoast SEO"
							"Sign up for the %1$s newsletter to receive best-practice tips on how to rank, stay up-to-date with the latest SEO news and get guidance on how to use %2$s to the fullest!",
							"wordpress-seo"
						),
						"Yoast",
						"Yoast SEO"
					)
				}
			</p>
			<div className="yst-flex yst-items-end yst-gap-2 yst-mt-4">
				<TextInput
					label={ __( "Email address", "wordpress-seo" ) }
					id="newsletter-email"
					name="newsletter email"
					value={ newsletterEmail }
					onChange={ setNewsletterEmail }
					type="email"
					placeholder={ __( "E.g. example@email.com", "wordpress-seo" ) }
					className="yst-grow"
					error={ {
						isVisible: signUpState === "error",
						message: emailFeedback,
					} }
				/>
				<button
					id="newsletter-sign-up-button"
					className="yst-button yst-button--primary yst-h-[45px] yst-items-center"
					onClick={ onSignUpClick }
					disabled={ signUpState === "loading" }
				>
					{ __( "Sign up!", "wordpress-seo" ) }
				</button>
			</div>
			<p className="yst-text-gray-500 yst-text-xxs yst-leading-4 yst-mt-1">
				{
					addLinkToString(
						sprintf(
							// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
							__(
								"Yoast respects your privacy. Read %1$sour privacy policy%2$s on how we handle your personal information.",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						gdprLink,
						"yoast-configuration-workout-gdpr-link"
					)
				}
			</p>
		</Fragment>
	);
}

NewsletterSignup.propTypes = {
	gdprLink: PropTypes.string,
};

NewsletterSignup.defaultProps = {
	gdprLink: "",
};
