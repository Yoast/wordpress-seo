/* global wpseoAdminL10n */
import { LockClosedIcon } from "@heroicons/react/solid";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { SvgIcon } from "@yoast/components";
import { LocationContext, useRootContext } from "@yoast/externals/contexts";
import { colors } from "@yoast/style-guide";
import { Badge, useSvgAria, useToggleState } from "@yoast/ui-library";
import { MetaboxButton } from "../MetaboxButton";
import SidebarButton from "../SidebarButton";
import { ModalSmallContainer } from "./Container";
import Modal, { defaultModalClassName } from "./Modal";
import MultipleKeywords from "./MultipleKeywords";

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

	return (
		<>
			{ isOpen && (
				<Modal
					title={ __( "Add related keyphrases", "wordpress-seo" ) }
					onRequestClose={ closeModal }
					additionalClassName=""
					id="yoast-additional-keyphrases-modal"
					className={ `${ defaultModalClassName } yoast-gutenberg-modal__box yoast-gutenberg-modal__no-padding` }
					shouldCloseOnClickOutside={ true }
				>
					<ModalSmallContainer>
						<MultipleKeywords buyLink={ addQueryArgs( buyLink, { context: locationContext } ) } />
					</ModalSmallContainer>
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
					<MetaboxButton
						id="yoast-additional-keyphrase-metabox-modal-open-button"
						onClick={ openModal }
					>
						<SvgIcon icon="plus" color={ colors.$color_grey_medium_dark } />
						<MetaboxButton.Text>
							{ __( "Add related keyphrase", "wordpress-seo" ) }
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

export default KeywordUpsell;
