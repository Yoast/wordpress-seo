/* global wpseoAdminL10n */
import { LockClosedIcon } from "@heroicons/react/solid";
import { useContext } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { SvgIcon } from "@yoast/components";
import { LocationContext, useRootContext } from "@yoast/externals/contexts";
import { colors } from "@yoast/style-guide";
import { Badge, useSvgAria, useToggleState } from "@yoast/ui-library";
import { ModalContainer } from "./modals/Container";
import Modal, { defaultModalClassName } from "./modals/Modal";
import SidebarButton from "./SidebarButton";
import UpsellBox from "./UpsellBox";

/**
 * @returns {Object} The location context.
 */
const useLocation = () => useContext( LocationContext );

/**
 * Renders the UpsellBox component.
 *
 * @returns {JSX.Element} The UpsellBox component.
 */
const KeywordUpsell = () => {
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const location = useLocation();
	const { locationContext } = useRootContext();
	const svgAriaProps = useSvgAria();

	const buyLink = wpseoAdminL10n[
		location.toLowerCase() === "sidebar"
			? "shortlinks.upsell.sidebar.additional_button"
			: "shortlinks.upsell.metabox.additional_button"
	];
	const infoParagraphs = [
		__( "Get help optimizing for up to 5 related keyphrases. This helps you reach a wider audience and get more traffic.", "wordpress-seo" ),
		<span key="KeywordUpsell-infoParagraph-benefitsTitle" className="yst-text-[#303030] yst-text-[13px] yst-font-semibold">
			{ __( "What’s more in Yoast SEO Premium?", "wordpress-seo" ) }
		</span>,
	];
	const benefits = [
		__( "Get extra SEO checks with the Premium SEO analysis", "wordpress-seo" ),
		__( "Avoid dead links on your site", "wordpress-seo" ),
		__( "Easily improve the structure of your site", "wordpress-seo" ),
		__( "Preview how your content looks when shared on social", "wordpress-seo" ),
		__( "Get guidance & save time on routine SEO tasks", "wordpress-seo" ),
	];

	return (
		<>
			{ isOpen && (
				<Modal
					title={ __( "Add related keyphrases", "wordpress-seo" ) }
					onRequestClose={ closeModal }
					additionalClassName=""
					className={ defaultModalClassName }
					id="yoast-premium-seo-analysis-modal"
					shouldCloseOnClickOutside={ true }
				>
					<ModalContainer>
						<h2>{ __( "Reach a wider audience", "wordpress-seo" ) }</h2>
						<UpsellBox
							infoParagraphs={ infoParagraphs }
							benefits={ benefits }
							upsellButtonText={
								sprintf(
									/* translators: %s expands to 'Yoast SEO Premium'. */
									__( "Unlock with %s", "wordpress-seo" ),
									"Yoast SEO Premium"
								)
							}
							upsellButton={ {
								href: addQueryArgs( buyLink, { context: locationContext } ),
								className: "yoast-button-upsell",
								rel: null,
								"data-ctb-id": "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
								"data-action": "load-nfd-ctb",
							} }
							upsellButtonLabel={ __( "1 year of premium support and updates included!", "wordpress-seo" ) }
						/>
					</ModalContainer>
				</Modal>
			) }
			{ location === "sidebar" && (
				<SidebarButton
					id="yoast-additional-keyphrase-modal-open-button"
					title={ __( "Add related keyphrase", "wordpress-seo" ) }
					prefixIcon={ { icon: "plus", color: colors.$color_grey_medium_dark } }
					onClick={ openModal }
				>
					<div className="yst-root">
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" { ...svgAriaProps } />
						</Badge>
					</div>
				</SidebarButton>
			) }
			{ location === "metabox" && (
				<div className="yst-root">
					<button
						id="yoast-additional-keyphrase-metabox-modal-open-button"
						type="button"
						className="yst-flex yst-items-center yst-w-full yst-pl-6 yst-p-4 yst-space-x-2 yst-border-t yst-border-t-[rgb(0,0,0,0.2)] yst-rounded-none yst-transition-all hover:yst-bg-[#f0f0f0] focus:yst-outline focus:yst-outline-[1px] focus:yst-outline-[color:#0066cd] focus:-yst-outline-offset-1 focus:yst-shadow-[0_0_3px_rgba(8,74,103,0.8)]"
						onClick={ openModal }
					>
						<SvgIcon icon="plus" color={ colors.$color_grey_medium_dark } />
						<span
							className="yst-grow yst-overflow-hidden yst-overflow-ellipsis yst-whitespace-nowrap yst-font-wp yst-text-[#555] yst-text-base yst-leading-[normal] yst-subpixel-antialiased yst-text-left"
						>
							{ __( "Add related keyphrase", "wordpress-seo" ) }
						</span>
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-mr-1 yst-shrink-0" { ...svgAriaProps } />
							<span>Premium</span>
						</Badge>
					</button>
				</div>
			) }
		</>
	);
};

export default KeywordUpsell;
