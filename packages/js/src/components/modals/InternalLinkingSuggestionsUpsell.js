/* global wpseoAdminL10n */
import { LockClosedIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext } from "@yoast/externals/contexts";
import { Badge, useSvgAria, useToggleState } from "@yoast/ui-library";
import { getPremiumBenefits } from "../../helpers/get-premium-benefits";
import { MetaboxButton } from "../MetaboxButton";
import SidebarButton from "../SidebarButton";
import UpsellBox from "../UpsellBox";
import { ModalSmallContainer } from "./Container";
import Modal, { defaultModalClassName } from "./Modal";

/**
 * @returns {JSX.Element} The element.
 */
export const InternalLinkingSuggestionsUpsell = () => {
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const { locationContext } = useRootContext();
	const svgAriaProps = useSvgAria();

	const isSidebar = locationContext.includes( "sidebar" );
	const isMetabox = locationContext.includes( "metabox" );
	const buyLink = wpseoAdminL10n[
		isSidebar
			? "shortlinks.upsell.sidebar.internal_linking_suggestions"
			: "shortlinks.upsell.metabox.internal_linking_suggestions"
	];

	return (
		<>
			{ isOpen && (
				<Modal
					title={ __( "Get internal linking suggestions", "wordpress-seo" ) }
					onRequestClose={ closeModal }
					additionalClassName=""
					id="yoast-internal-linking-suggestions-upsell"
					className={ `${ defaultModalClassName } yoast-gutenberg-modal__box yoast-gutenberg-modal__no-padding` }
					shouldCloseOnClickOutside={ true }
				>
					<ModalSmallContainer>
						<UpsellBox
							title={ __( "Rank higher by connecting your content", "wordpress-seo" ) }
							description={ sprintf(
								/* translators: %s expands to Yoast SEO Premium. */
								__( "%s automatically suggests to what content you can link with easy drag-and-drop functionality, which is good for your SEO!", "wordpress-seo" ),
								"Yoast SEO Premium"
							) }
							benefitsTitle={
								sprintf(
									/* translators: %s expands to 'Yoast SEO Premium'. */
									__( "%s also gives you:", "wordpress-seo" ),
									"Yoast SEO Premium" )
							}
							benefits={ getPremiumBenefits() }
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
							upsellButtonLabel={ __( "1 year free support and updates included!", "wordpress-seo" ) }
						/>
					</ModalSmallContainer>
				</Modal>
			) }
			{ isSidebar && (
				<SidebarButton
					id="yoast-internal-linking-suggestions-sidebar-modal-open-button"
					title={ __( "Internal linking suggestions", "wordpress-seo" ) }
					onClick={ openModal }
				>
					<div className="yst-root">
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" { ...svgAriaProps } />
						</Badge>
					</div>
				</SidebarButton>
			) }
			{ isMetabox && (
				<div className="yst-root">
					<MetaboxButton
						id="yoast-internal-linking-suggestions-metabox-modal-open-button"
						onClick={ openModal }
					>
						<MetaboxButton.Text>
							{ __( "Internal linking suggestions", "wordpress-seo" ) }
						</MetaboxButton.Text>
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-me-1 yst-shrink-0" { ...svgAriaProps } />
							<span>Premium</span>
						</Badge>
					</MetaboxButton>
				</div>
			) }
		</>
	);
};
