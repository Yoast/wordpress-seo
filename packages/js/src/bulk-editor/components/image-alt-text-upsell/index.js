import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { useToggleState } from "@yoast/ui-library";
import { FIELD_SET_IMAGE_ALT_TEXT, STORE_NAME } from "../../constants";
import { UpdateModal } from "../update-modal";
import { DummyImageAltTextTable } from "./upsell-dummy-table";
import { ImageAltTextUpsellCard } from "./upsell-card";

/**
 * The "Image alt text" tab content while Yoast WooCommerce SEO is not supplying the tab itself.
 *
 * Without the add-on, the upsell card on top of a faded impression of the add-on's tab. With a version that
 * predates the tab, the update modal over the empty panel. A supported version fills the slot itself, so the panel
 * stays empty while its script is still loading.
 *
 * @returns {JSX.Element} The upsell block, or the empty panel.
 */
export const ImageAltTextUpsell = () => {
	const { isWooSeoActive, isWooSeoVersionSupported, isTabActive } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			isWooSeoActive: store.selectPreference( "isWooSeoActive", false ),
			isWooSeoVersionSupported: store.selectPreference( "isWooSeoVersionSupported", false ),
			isTabActive: store.selectActiveFieldSet() === FIELD_SET_IMAGE_ALT_TEXT,
		};
	}, [] );
	// There is no control in the tab to hang the modal on, so it opens with the panel. The panel stays mounted
	// while other tabs are shown, so it opens again every time the tab does.
	const [ isUpdateModalOpen, , , openUpdateModal, closeUpdateModal ] = useToggleState( true );
	useEffect( () => {
		if ( isTabActive ) {
			openUpdateModal();
		}
	}, [ isTabActive, openUpdateModal ] );

	if ( ! isWooSeoActive ) {
		return (
			<div className="yst-grid">
				<div className="yst-col-start-1 yst-row-start-1 yst-min-w-0">
					<DummyImageAltTextTable />
				</div>
				<div className="yst-relative yst-z-10 yst-col-start-1 yst-row-start-1 yst-min-w-0 yst-flex yst-items-center yst-justify-center yst-p-4 sm:yst-p-6">
					<ImageAltTextUpsellCard />
				</div>
			</div>
		);
	}

	return (
		<>
			{ isTabActive && ! isWooSeoVersionSupported && (
				<UpdateModal
					isOpen={ isUpdateModalOpen }
					onClose={ closeUpdateModal }
					updateUrlPreference="wooSeoUpdateUrl"
					description={ sprintf(
						/* translators: %s expands to "Yoast WooCommerce SEO". */
						__( "To manage the alt text of your product images here, please update %s to the latest version.", "wordpress-seo" ),
						"Yoast WooCommerce SEO"
					) }
				/>
			) }
		</>
	);
};
