import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { OutboundLink } from ".";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * Introduction modal for the AI generation of titles and descriptions.
 *
 * @param {function} onGiveConsent Callback to signal consent is given.
 * @param {string} learnMoreLink The learn more link.
 * @param {string} privacyPolicyLink The privacy policy link.
 * @param {string} termsOfServiceLink The terms of service link.
 * @param {Object} imageLink The thumbnail: img props.
 *
 * @returns {JSX.Element} The element.
 */
export const AiConsent = ( {
	onGiveConsent,
	learnMoreLink,
	privacyPolicyLink,
	termsOfServiceLink,
	imageLink,
} ) => {
	const { onClose, initialFocus } = useModalContext();
	const [ consent, toggleConsent ] = useToggleState( false );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const checkboxLabel = safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are a set of anchor tags and %3$s and %4$s are a set of anchor tags. */
			__(
				"I approve the %1$sTerms of Service%2$s & %3$sPrivacy Policy%4$s of the Yoast AI service. This includes consenting to the collection and use of data to improve user experience.",
				"wordpress-seo"
			),
			"<a1>",
			"</a1>",
			"<a2>",
			"</a2>"
		),
		{

			a1: <OutboundLink href={ termsOfServiceLink } />,

			a2: <OutboundLink href={ privacyPolicyLink } />,
		}
	);

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<div className="yst-relative yst-w-full">
					<img
						className="yst-w-full yst-h-auto yst-rounded-md yst-drop-shadow-md"
						alt=""
						loading="lazy"
						decoding="async"
						{ ...thumbnail }
					/>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{ sprintf(
							/* translators: %s expands to Yoast AI. */
							__( "Grant consent for %s", "wordpress-seo" ),
							"Yoast AI"
						) }
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						{ safeCreateInterpolateElement(
							sprintf(
								/* translators: %1$s is a break tag; %2$s and %3$s are anchor tag; %4$s is the arrow icon. */
								__(
									"Enable AI-powered SEO! Use all AI Generate and Optimize features to boost your efficiency. Just give us the green light. %1$s%2$sLearn more%3$s%4$s",
									"wordpress-seo"
								),
								"<br/>",
								"<a>",
								"<ArrowNarrowRightIcon />",
								"</a>"
							),
							{

								a: <OutboundLink
									href={ learnMoreLink }
									className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
									variant="primary"
								/>,
								ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
								br: <br />,
							}
						) }
					</div>
				</div>
				<div className="yst-flex yst-w-full yst-mt-6">
					<hr className="yst-w-full yst-text-gray-200" />
				</div>
				<div className="yst-flex yst-items-start yst-mt-4">
					<input
						type="checkbox"
						id="yst-ai-consent-checkbox"
						name="yst-ai-consent-checkbox"
						checked={ consent }
						value={ consent ? "true" : "false" }
						onChange={ toggleConsent }
						className="yst-checkbox__input"
						ref={ initialFocus }
					/>
					<label
						htmlFor="yst-ai-consent-checkbox"
						className="yst-label yst-checkbox__label yst-text-xs yst-font-normal yst-text-slate-500"
					>
						{ checkboxLabel }
					</label>
				</div>
				<div className="yst-w-full yst-flex yst-mt-4">
					<Button
						as="button"
						className="yst-grow"
						size="large"
						disabled={ ! consent }
						onClick={ onGiveConsent }
					>
						{ __( "Grant consent", "wordpress-seo" ) }
					</Button>
				</div>
				<Button
					as="button"
					className="yst-mt-4"
					variant="tertiary"
					onClick={ onClose }
				>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};
AiConsent.propTypes = {
	onGiveConsent: PropTypes.func.isRequired,
	learnMoreLink: PropTypes.string.isRequired,
	privacyPolicyLink: PropTypes.string.isRequired,
	termsOfServiceLink: PropTypes.string.isRequired,
	imageLink: PropTypes.string.isRequired,
};
