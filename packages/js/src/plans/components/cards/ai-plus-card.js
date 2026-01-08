import { CheckCircleIcon } from "@heroicons/react/solid";
import { Card, Title, useSvgAria } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { STORE_NAME } from "../../constants";
import { ButtonLinkWithArrow } from "../actions/button-link-with-arrow";
import { ReactComponent as AiPlusSvg } from "../../../../images/ai-plus-plans.svg";

/**
 * A base card component for the Yoast AI+ plan.
 *
 * @param {React.ReactNode} header The header content of the card. An SVG is expected.
 * @param {string} title The title of the card, typically the product name.
 * @param {string} description The description of the product.
 * @param {string} [listDescription] An optional description for the list of features.
 * @param {string[]} list A list of features of the product.
 * @param {React.ReactNode} [includes] An optional section to specify the "Now includes" plugins.
 * @param {string} learnMoreLink The URL to learn more about the product.
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
					<ButtonLinkWithArrow variant="primary" label={ __( "Learn more", "wordpress-seo" ) } href={ learnMoreLink }   />
				</Card.Footer>
			</Card>
		</div>
	);
};

/**
 * A card to present the Yoast AI+ plan.
 * @returns {JSX.Element} The element.
 */
export const AiPlusCard = () => {
	const learnMoreLink = useSelect( ( select ) =>  select( STORE_NAME ).selectLink( "https://yoa.st/plans-ai-plus-learn-more" ), [] );

	return (
		<BaseAiPlusCard
			header={ <AiPlusSvg /> }
			title="Yoast AI+"
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
		/>
	);
};
