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
				source: "free",
			}
		),
	} );
	return response.json();
}

const genericErrorFeedback = __( "Oops! Something went wrong. Check your email address and try again.", "wordpress-seo" );
const invalidEmailFeedback = __( "Please enter a valid email address.", "wordpress-seo" );
const subscribedFeedback = __( "Thank you! Check your inbox for the confirmation email.", "wordpress-seo" );

/**
 * The newsletter signup section.
 *
 * @param {string} [gdprLink=""] Shortlink to the Yoast privacy policy.
 * @returns {JSX.Element} An element.
 */
export function NewsletterSignup( { gdprLink = "" } ) {
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
				setEmailFeedback( subscribedFeedback );
			}
		},
		[ newsletterEmail ]
	);

	const onEmailChange = useCallback( ( event ) => {
		setSignUpState( "waiting" );
		setNewsletterEmail( event.target.value );
	}, [ setNewsletterEmail ] );

	return (
		<Fragment>
			<h4 className="yst-text-slate-800 yst-text-sm yst-leading-6 yst-font-medium">
				{
					__(
						"Get free weekly SEO tips!",
						"wordpress-seo"
					)
				}
			</h4>
			<p className="yst-my-2">
				{
					sprintf(
						/* translators: %1$s expands to "Yoast SEO", %2$s expands to "Yoast SEO". */
						__(
							"Subscribe to the %1$s newsletter to receive best practices for improving your rankings, save time on SEO tasks, stay up-to-date with the latest SEO news, " +
							"and get expert guidance on how to make the most of %2$s!",
							"wordpress-seo"
						),
						"Yoast SEO",
						"Yoast SEO"
					)
				}
			</p>
			<div className="yst-flex yst-items-start yst-gap-2 yst-mt-4 yst-mb-2">
				<TextInput
					label={ __( "Email address", "wordpress-seo" ) }
					id="newsletter-email"
					name="newsletter email"
					value={ newsletterEmail }
					onChange={ onEmailChange }
					className="yst-grow"
					type="email"
					placeholder={ __( "E.g. example@email.com", "wordpress-seo" ) }
					feedback={ {
						isVisible: [ "error", "success" ].includes( signUpState ),
						type: signUpState,
						message: [ emailFeedback ],
					} }
				/>
				<button
					type="button"
					id="newsletter-sign-up-button"
					// Added a custom margin top because of the TextInput label. Aligning to flex-end won't work because of the error feedback.
					className="yst-button yst-button--primary yst-h-[40px] yst-items-center yst-mt-[27.5px] yst-shrink-0"
					onClick={ onSignUpClick }
					disabled={ signUpState === "loading" }
					data-hiive-event-name="clicked_signup | personal preferences"
				>
					{ __( "Yes, give me your free tips!", "wordpress-seo" ) }
				</button>
			</div>
			<p className="yst-text-slate-500 yst-text-xxs yst-leading-4">
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
						"yoast-configuration-gdpr-link"
					)
				}
			</p>
		</Fragment>
	);
}

NewsletterSignup.propTypes = {
	gdprLink: PropTypes.string,
};
