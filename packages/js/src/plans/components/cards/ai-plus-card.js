import CheckCircleIcon from "@heroicons/react/solid/esm/CheckCircleIcon";
import { Badge, Card, Title, useSvgAria } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { ADD_ONS, STORE_NAME } from "../../constants";
import { ButtonLinkWithArrow } from "../actions/button-link-with-arrow";
import { CardLink } from "../actions/card-link";
import { ReactComponent as AiPlusSvg } from "../../../../images/ai-plus-plans.svg";

/**
 * Renders a badge at the top of the card when text is provided.
 *
 * @param {?string} text The badge text. If null, nothing is rendered.
 *
 * @returns {?JSX.Element} The badge element or null.
 */
const AiPlusCardBadge = ( { text } ) => {
	if ( ! text ) {
		return null;
	}

	return (
		<div className="yst-absolute yst-top-0 yst--translate-y-1/2 yst-w-full yst-text-center">
			<Badge size="small" className="yst-border" variant="info">
				{ text }
			</Badge>
		</div>
	);
};

/**
 * The footer actions for the AI+ card.
 *
 * @param {string} learnMoreLink The URL to learn more about the product.
 * @param {?string} buyLink An optional URL for the primary CTA button.
 * @param {?string} buyLabel An optional label for the primary CTA button.
 *
 * @returns {JSX.Element} The element.
 */
const AiPlusCardActions = ( { learnMoreLink, buyLink, buyLabel } ) => {
	if ( buyLink ) {
		return (
			<div className="yst-flex yst-flex-col yst-gap-y-1">
				<CardLink label={ buyLabel } href={ buyLink } />
				<ButtonLinkWithArrow
					variant="tertiary"
					className="yst-py-0 yst-mt-2"
					iconClassName="yst-ml-1.5"
					label={ __( "Learn more", "wordpress-seo" ) }
					href={ learnMoreLink }
				/>
			</div>
		);
	}

	return <ButtonLinkWithArrow variant="primary" label={ __( "Learn more", "wordpress-seo" ) } href={ learnMoreLink } />;
};

/**
 * A base card component for the Yoast AI+ plan.
 *
 * @param {string} title The title of the card, typically the product name.
 * @param {string} description The description of the product.
 * @param {string} [listDescription] An optional description for the list of features.
 * @param {string[]} list A list of features of the product.
 * @param {React.ReactNode} [includes] An optional section to specify the "Now includes" plugins.
 * @param {string} learnMoreLink The URL to learn more about the product.
 * @param {?string} badge An optional badge text to display at the top of the card.
 * @param {?string} buyLink An optional URL for the primary CTA button.
 * @param {?string} buyLabel An optional label for the primary CTA button.
 *
 * @returns {JSX.Element} The element.
 */
const BaseAiPlusCard = ( {
	title,
	description,
	listDescription,
	list,
	includes,
	learnMoreLink,
	badge = null,
	buyLink = null,
	buyLabel = null,
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<div className="yst-flex yst-relative yst-max-w-64">
			<Card>
				<Card.Header className="yst-overflow-hidden yst-h-auto yst-p-0"><AiPlusSvg /></Card.Header>
				<Card.Content className="yst-flex yst-flex-col">
					<Title as="h2">{ title }</Title>
					<p className="yst-mt-3">{ description }</p>
					<hr className="yst-my-6 yst-border-t yst-border-slate-200" />
					{ listDescription && <p className="yst-mb-3">{ listDescription }</p> }
					<div className="yst-flex yst-flex-col yst-gap-y-2" role="list">
						{ list.map( ( item, index ) => (
							<div key={ `list-item--${ index }` } className="yst-flex yst-gap-x-2" role="listitem">
								<CheckCircleIcon className="yst-w-5 yst-h-5 yst-shrink-0 yst-text-green-500" { ...svgAriaProps } />
								{ item }
							</div>
						) ) }
					</div>
				</Card.Content>
				<Card.Footer className="yst-pt-4 yst-mt-auto">
					{ includes && (
						<>
							<span className="yst-block yst-font-medium yst-leading-none">{ __( "Now includes:", "wordpress-seo" ) }</span>
							<span className="yst-text-xxs yst-text-slate-500">{ includes }</span>
							<hr className="yst-mt-4 yst-mb-6 yst-border-t yst-border-slate-200" />
						</>
					) }
					<AiPlusCardActions learnMoreLink={ learnMoreLink } buyLink={ buyLink } buyLabel={ buyLabel } />
				</Card.Footer>
			</Card>
			<AiPlusCardBadge text={ badge } />
		</div>
	);
};

/**
 * A card to present the Yoast AI+ plan.
 * @returns {JSX.Element} The element.
 */
export const AiPlusCard = () => {
	const { isPremiumActive, learnMoreLink, freeTrialLink } = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );
		return {
			isPremiumActive: plansSelect.selectAddOnIsActive( ADD_ONS.premium ),
			learnMoreLink: plansSelect.selectLink( "https://yoa.st/plans-ai-plus-learn-more" ),
			freeTrialLink: plansSelect.selectLink( "https://yoa.st/aibi-plans-free-trial" ),
		};
	}, [] );

	return (
		<BaseAiPlusCard
			title="Yoast SEO AI+"
			description={
				__( "For marketers and content publishers looking to boost brand awareness and visibility, this package combines powerful on page SEO tools with AI brand monitoring and insights.", "wordpress-seo" )
			}
			listDescription={ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %2$s expand to an opening and closing span tag for styling. */
					__( "Includes all %1$sWooCommerce SEO%2$s features, plus:", "wordpress-seo" ),
					"<span>",
					"</span>"
				),
				{ span: <span className="yst-font-medium yst-text-slate-800" /> }
			) }
			list={ [
				__( "Track and measure brand visibility in AI platforms", "wordpress-seo" ),
				__( "Build and protect your brand reputation with insights", "wordpress-seo" ),
				__( "Optimize your site for visitors, search and LLMs", "wordpress-seo" ),
			] }
			learnMoreLink={ learnMoreLink }
			includes="Local SEO + Video SEO + News SEO"
			badge={ isPremiumActive ? __( "Free trial available", "wordpress-seo" ) : null }
			buyLink={ isPremiumActive ? freeTrialLink : null }
			buyLabel={ isPremiumActive ? __( "Start your free trial", "wordpress-seo" ) : null }
		/>
	);
};
