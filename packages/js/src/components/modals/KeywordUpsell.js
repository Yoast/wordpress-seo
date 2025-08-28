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
import { MultiKeyphraseUpsellModal } from "../modals/MultiKeyphraseUpsellModal";

/**
 * @returns {Object} The location context.
 */
const useLocation = () => useContext( LocationContext );

/**
 * Renders the upsell button and modal.
 *
 * @returns {JSX.Element} The KeywordUpsell component.
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
			<MultiKeyphraseUpsellModal
				isOpen={ isOpen }
				closeModal={ closeModal }
				upsellLink={ addQueryArgs( buyLink, { context: locationContext } ) }
				id={ `yoast-additional-keyphrases-modal-${ location }` }
			/>

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
