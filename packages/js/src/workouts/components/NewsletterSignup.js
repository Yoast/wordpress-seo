import { useCallback, useState, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isEmail } from "@wordpress/url";

import { NewButton as Button } from "@yoast/components";
import { addLinkToString } from "../../helpers/stringHelpers";
import ValidatedTextInput from "../components/ValidatedTextInput";

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
 * @param {string} gdprLink Shortlink to the Yoast Privacy policy.
 *
 * @returns {WPElement} A newslettersignup element.
 */
export function NewsletterSignup( gdprLink ) {
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
			<ul className="yoast-list--usp">
				<li>{ __( "Receive best-practice tips and learn how to rank on search engines", "wordpress-seo" ) }</li>
				<li>{ __( "Stay up-to-date with the latest SEO news", "wordpress-seo" ) }</li>
				<li>{ __( "Get guidance on how to use Yoast SEO to the fullest", "wordpress-seo" ) }</li>
			</ul>
			<div className="yoast-newsletter-signup">
				<ValidatedTextInput
					label={ __( "Email address", "wordpress-seo" ) }
					id="newsletter-email"
					name="newsletter email"
					value={ newsletterEmail }
					onChange={ setNewsletterEmail }
					type="email"
					feedbackState={ signUpState }
					feedbackMessage={ emailFeedback }
					inputExplanation={
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
				/>
				<Button
					id="newsletter-sign-up-button"
					variant="primary"
					onClick={ onSignUpClick }
					disabled={ signUpState === "loading" }
				>
					{ __( "Sign up!", "wordpress-seo" ) }
				</Button>
			</div>
		</Fragment>
	);
}
