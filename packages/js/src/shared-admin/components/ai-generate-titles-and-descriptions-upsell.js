import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { OutboundLink } from "./outbound-link";

/**
 * @param {string} imageLink The image link.
 * @param {string} learnMoreLink The learn more link.
 * @param {string} upsellLink The upsell link.
 * @returns {JSX.Element} The element.
 */
export const AiGenerateTitlesAndDescriptionsUpsell = ( { imageLink, learnMoreLink, upsellLink } ) => {
	const { onClose, initialFocus } = useModalContext();

	return (
		<div className="yst-flex yst-flex-col yst-items-center yst-p-10">
			<div className="yst-relative">
				<img
					className="yst-rounded-md yst-drop-shadow-md"
					src={ imageLink }
					width="432"
					height="244"
					alt=""
					loading="lazy"
					decoding="async"
				/>
				<Badge className="yst-absolute yst-top-0 yst-right-2 yst-mt-2 yst-ml-2" variant="upsell">Premium</Badge>
			</div>
			<div className="yst-mt-6 yst-text-xs yst-font-medium">
				<span className="yst-uppercase yst-text-slate-500">
					{ sprintf(
						/* translators: %1$s expands to Yoast SEO Premium. */
						__( "New to %1$s", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
				</span>
				&nbsp;
				<span className="yst-uppercase yst-text-slate-700">21.X</span>
			</div>
			<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
				<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
					{ __( "Generate titles & descriptions with Yoast AI!", "wordpress-seo" ) }
				</h3>
				<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
					{ createInterpolateElement(
						sprintf(
							/* translators: %1$s and %2$s are anchor tag; %3$s is the arrow icon. */
							__(
								"Speed up your workflow with generative AI. Get high-quality title and description suggestions for your search and social appearance. %1$sLearn more%2$s%3$s",
								"wordpress-seo"
							),
							"<a>",
							"<ArrowNarrowRightIcon />",
							"</a>"
						),
						{
							// eslint-disable-next-line jsx-a11y/anchor-has-content
							a: <OutboundLink
								href={ learnMoreLink }
								className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
								variant="primary"
							/>,
							ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
						}
					) }
				</div>
			</div>
			<div className="yst-w-full yst-flex yst-mt-10">
				<Button
					as="a"
					className="yst-grow"
					size="large"
					variant="upsell"
					href={ upsellLink }
					target="_blank"
					ref={ initialFocus }
				>
					<LockOpenIcon className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5" />
					{ __( "Unlock with Premium", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }
					</span>
				</Button>
			</div>
			<Button
				as="a"
				className="yst-mt-4"
				variant="tertiary"
				onClick={ onClose }
			>
				{ __( "Close", "wordpress-seo" ) }
			</Button>
		</div>
	);
};
AiGenerateTitlesAndDescriptionsUpsell.propTypes = {
	imageLink: PropTypes.string.isRequired,
	learnMoreLink: PropTypes.string.isRequired,
	upsellLink: PropTypes.string.isRequired,
};