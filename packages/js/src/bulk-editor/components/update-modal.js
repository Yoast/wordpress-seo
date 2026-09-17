import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import { Button, useSvgAria } from "@yoast/ui-library";
import { DangerModal, ModalDescription, Actions, CloseButton } from "../../shared-admin/components/danger-modal";
import { STORE_NAME } from "../constants";

/**
 * The update modal shown when an installed Yoast plugin is too old for a bulk editor feature.
 *
 * Defaults to Yoast SEO Premium, whose AI bulk actions need a recent version; the products "Image alt text" tab
 * uses it for Yoast WooCommerce SEO.
 *
 * @param {Object} props The props.
 * @param {Function} props.onClose The callback to close the modal.
 * @param {boolean} props.isOpen Whether the modal is open.
 * @param {string} [props.pluginName] The plugin to update.
 * @param {string} [props.updateUrlPreference] The preference holding the plugin's one-click update URL.
 * @param {string} [props.description] The body copy; defaults to the AI features copy.
 *
 * @returns {JSX.Element} The update modal.
 */
export const UpdateModal = ( {
	onClose,
	isOpen,
	pluginName = "Yoast SEO Premium",
	updateUrlPreference = "premiumUpdateUrl",
	description = "",
} ) => {
	const ariaProps = useSvgAria();
	const updateUrl = useSelect( ( select ) => select( STORE_NAME ).selectPreference( updateUrlPreference, "" ), [ updateUrlPreference ] );
	return (
		<DangerModal isOpen={ isOpen } onClose={ onClose } title={ __( "Your plugin needs an update", "wordpress-seo" ) }>
			<ModalDescription>
				{ description || sprintf(
					/** translators: %s: plugin name */
					__( "To use AI features, please update %s to the latest version.", "wordpress-seo" ),
					pluginName
				) }
			</ModalDescription>
			<Actions>
				<CloseButton onClick={ onClose } />
				{ updateUrl && <Button
					id="yst-bulk-editor-update-modal"
					className="yst-pe-2.5 yst-flex yst-gap-1.5 yst-items-center"
					href={ updateUrl }
					target="_blank"
					rel="noopener noreferrer"
					as="a"
				>
					{ __( "Update now", "wordpress-seo" ) }
					<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
					<ArrowNarrowRightIcon className="yst-h-4 yst-w-4 rtl:yst-rotate-180 yst-shrink-0" { ...ariaProps } />
				</Button> }
			</Actions>
		</DangerModal>
	);
};
