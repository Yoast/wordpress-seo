
import { STORE_NAME_INTRODUCTIONS } from "../../constants";
import { Modal } from "../modal";
import { __, sprintf } from "@wordpress/i18n";
import { Feature } from "../features/feature";
import { featuresData, perksData } from "../features/features-data";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { ExternalLinkIcon, CheckIcon } from "@heroicons/react/outline";
import { Button, useModalContext } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";

/**
 * @param {string} buttonUpgradeLink The button upgrade link.
 * @param {string} buttonExploreFeaturesLink The button explore features link.
 * @returns {JSX.Element} The element.
 */
const DelayedPremiumUpsellContent = ( { buttonUpgradeLink, exploreFeaturesLink } ) => {
	const { onClose } = useModalContext();
	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-mb-8  yst-delayed-introduction-gradient">
				<h1 className="yst-text-black yst-font yst-font-medium yst-text-2xl yst-leading-7">{ sprintf(
				/* translators: %1$s expands to Yoast SEO. */
					__( "You've been optimizing with %1$s for a while!", "wordpress-seo" ),
					"Yoast SEO" ) }
				</h1>
				<div className="yst-text-slate-600 yst-mt-4 yst-mb-8">
					{ safeCreateInterpolateElement(
						sprintf(
							/* translators: %1$s and %3$s expand to <strong> and </strong> respectively. %2$s expands to Yoast SEO Premium. */
							__( "Upgrade to %1$s%2$s%3$s and unlock more features to grow your traffic while making SEO easier, faster and more effective!", "wordpress-seo" ),
							"<strong>",
							"Yoast SEO Premium",
							"</strong>" ),
						{
							strong: <strong className="yst-font-semibold yst-text-primary-500" />,
						} ) }
				</div>
			</div>

			<div className="yst-@container yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 yst-gap-4 yst-px-10">
				{ featuresData.map( ( feature, index ) =>
					<Feature
						key={ index }
						icon={ feature.icon }
						title={ feature.title }
						description={ feature.description }
						iconClassName={ feature.iconClassName }
					/> )
				}
			</div>

			<div className="yst-text-slate-600 yst-mt-4 yst-mb-8 yst-text-center">
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s and %3$s expand to <a> and </a> respectively. %2$s expands to Yoast SEO Premium. */
						__( "%1$sExplore all %2$s features%3$s", "wordpress-seo" ),
						"<a>",
						"Yoast SEO Premium",
						"</a>" ),
					{
						// eslint-disable-next-line jsx-a11y/anchor-has-content
						a: <a id="delayed-upsell" href={ exploreFeaturesLink }  className="yst-mt-6 yst-mb-8 yst-underline yst-text-indigo-600 yst-text-sm" />,
					} ) }
				<ExternalLinkIcon className=" yst-inline yst--me-2 yst-ms-2 yst-h-3 yst-w-3 yst-text-indigo-600 rtl:yst-rotate-[270deg]" />
			</div>

			<div className="yst-mt-8 yst-mx-10 yst-text-slate-900 yst-text-[16px] yst-border-b yst-border-black yst-pb-2 yst-font-medium">
				{ __( "Extra perks & help to make SEO even easier", "wordpress-seo" ) }
			</div>

			<div className="yst-grid yst-grid-cols-2 yst-gap-4 yst-px-10 yst-my-4">
				{ perksData.map( ( perk, index ) =>
					<div key={ index }>
						<CheckIcon className="yst-inline yst-text-green-600 yst-w-6 yst-h-6" />
						<span className="yst-text-slate-800 yst-font-medium">{ perk }</span>
					</div> )
				}
			</div>
			<div className="yst-px-10 yst-mt-8 yst-mb-4 yst-text-center">
				<Button
					as="a"
					className={ "yst-w-full yst-h-11 yst-font-medium yst-text-base yst-text-amber-900" }
					variant="upsell"
					href={ buttonUpgradeLink }
					target="_blank"
					rel="noreferrer"
				>
					{ sprintf(
						/* translators: %1$s expands to Yoast SEO Premium. */
						__( "Upgrade to %1$s", "wordpress-seo" ),
						"Yoast SEO Premium" ) }
				</Button>
				<Button
					className={ "yst-text-center yst-mt-4 yst-font-medium yst-text-base yst-text-primary-500" }
					onClick={ onClose }
					variant="tertiary"
				>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};

/**
 * @returns {JSX.Element} The element.
 */
export const DelayedPremiumUpsell = () => {
	const buttonUpgradeLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/delayed-upsell-premium-upgrade" ), [] );
	const exploreFeaturesLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/delayed-upsell-explore-premium-features" ), [] );
	return (
		<Modal maxWidth="yst-max-w-3xl">
			<DelayedPremiumUpsellContent
				buttonUpgradeLink={ buttonUpgradeLink }
				exploreFeaturesLink={ exploreFeaturesLink }
			/>
		</Modal>
	);
};
