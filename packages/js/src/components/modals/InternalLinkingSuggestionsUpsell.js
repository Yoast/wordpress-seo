/* global wpseoAdminL10n */
import { LockClosedIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext } from "@yoast/externals/contexts";
import { Badge, useSvgAria, useToggleState } from "@yoast/ui-library";
import { MetaboxButton } from "../MetaboxButton";
import SidebarButton from "../SidebarButton";
import { UpsellModal } from "./UpsellModal";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * @returns {JSX.Element} The element.
 */
export const InternalLinkingSuggestionsUpsell = () => {
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const { locationContext } = useRootContext();
	const svgAriaProps = useSvgAria();

	const isSidebar = locationContext.includes( "sidebar" );
	const isMetabox = locationContext.includes( "metabox" );
	const location = isSidebar ? "sidebar" : "metabox";
	const buyLink = wpseoAdminL10n[
		isSidebar
			? "shortlinks.upsell.sidebar.internal_linking_suggestions"
			: "shortlinks.upsell.metabox.internal_linking_suggestions"
	];

	return (
		<>
			<UpsellModal
				isOpen={ isOpen }
				onClose={ closeModal }
				id={ `yoast-internal-linking-suggestions-upsell-${location}` }
				upsellLink={ addQueryArgs( buyLink, { context: locationContext } ) }
				modalTitle={ __( "Get internal linking suggestions", "wordpress-seo" ) }
				title={ __( "Connect related content without the guesswork", "wordpress-seo" ) }
				description={ safeCreateInterpolateElement(
					sprintf(
						/* translators: %s expands to be tag. */
						__( "Optimize for up to 5 keyphrases to shape your content around different themes, audiences, and angles. %sScans your content to:", "wordpress-seo" ),
						"<br />"
					),
					{
						br: <br />,
					}
				) }
				benefits={ [
					__( "Suggest internal links based on your content’s main topics", "wordpress-seo" ),
					__( "Build relevant internal links faster", "wordpress-seo" ),
					__( "Strengthen your site’s structure", "wordpress-seo" ),
					__( "Keep visitors exploring longer", "wordpress-seo" ),

				] }
				note={ __( "Upgrade to link your content with ease", "wordpress-seo" ) }
				ctbId="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
			/>

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
