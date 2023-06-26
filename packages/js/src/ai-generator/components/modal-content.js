import PropTypes from "prop-types";
import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext }  from "@yoast/externals/contexts";
import { makeOutboundLink } from "@yoast/helpers";
import { Badge, Button, Link } from "@yoast/ui-library";
import { get } from "lodash";

/** ModalContent modal
 *
 * @param {func} onClose The callback for the close action.
 *
 * @returns {JSX.Element} The element.
*/
export const ModalContent = ( { onClose, focusElementRef } ) => {
	const pluginUrl = get( window, "wpseoScriptData.pluginUrl", "" );
	const { locationContext } = useRootContext();
	const learnMoreLink = addQueryArgs(
		useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://www.yoa.st/ai-generator-learn-more" ) ),
		{ context: locationContext }
	);
	const LearnMoreOutboundLink = makeOutboundLink();
	const upsellLink = addQueryArgs(
		useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/ai-generator-upsell" ) ),
		{ context: locationContext }
	);

	return (
		<div className="yst-flex yst-flex-col yst-items-center">
			<div className="yst-relative yst-mt-10">
				<img
					className="yst-rounded-md yst-drop-shadow-md"
					src={ `${pluginUrl}/images/ai-generator-preview.png` }
					width="432"
					height="244"
					alt=""
				/>
				<Badge
					className="yst-absolute yst-top-0 yst-right-2 yst-mt-2 yst-ml-2"
					variant="upsell"
				>
					Premium
				</Badge>
			</div>
			<div className="yst-mt-6 ">
				<span className="yst-uppercase yst-text-[12px] yst-font-medium yst-text-slate-500">{ __( "New to Yoast SEO Premium", "wordpress-seo" ) }</span>
				&nbsp;
				<span className="yst-uppercase yst-text-slate-700 yst-font-medium yst-text-[12px]">20.X</span>
			</div>
			<h3 className="yst-mt-4 yst-text-slate-900 yst-text-lg yst-font-medium">{ __( "Generate titles & descriptions with Yoast AI!", "wordpress-seo" ) }</h3>
			<span className="yst-mt-2 yst-mx-14 yst-text-center yst-text-slate-600 yst-text-[13px]">
				{ createInterpolateElement(
					/* eslint-disable max-len */
					// translators: %1$s and %2$s are anchor tag; %3$s is the right arrow icon.
					sprintf(
						__(
							"Speed up your workflow with generative AI. Get high-quality title and description suggestions for your search and social appearance. %1$sLearn more%2$s%3$s",
							"wordpress-seo"
						),
						/* eslint-enable max-len */
						"<a>",
						"<ArrowNarrowRightIcon />",
						"</a>"
					),
					{
						// eslint-disable-next-line jsx-a11y/anchor-has-content
						a: <LearnMoreOutboundLink
							href={ learnMoreLink }
							className="yst-no-underline yst-font-medium yst-text-[13px] yst-text-primary-500" target="_blank" rel="noopener noreferrer"
						/>,
						ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-inline-block yst-ml-1 yst-w-3, yst-h-3" />,
					}
				) }
			</span>
			<div className="yst-w-full yst-flex">
				<Button
					as="a"
					className="yst-mt-10 yst-grow yst-mx-10"
					size="large"
					variant="upsell"
					href={ upsellLink }
					target="_blank"
					ref={ focusElementRef }
				>
					<LockOpenIcon
						className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900"
					/>
					{ __( "Unlock with Premium", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
			</div>
			<Link
				className="yst-mt-6 yst-mb-10 yst-text-primary-500 yst-no-underline"
				as="button"
				onClick={ onClose }
			>
				{ __( "Close", "wordpress-seo" ) }
			</Link>
		</div>
	);
};

ModalContent.propTypes = {
	onClose: PropTypes.func.isRequired,
	focusElementRef: PropTypes.oneOf( [ PropTypes.func, PropTypes.object ] ).isRequired,
};
