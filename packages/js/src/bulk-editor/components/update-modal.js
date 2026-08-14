import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import { Button, useSvgAria } from "@yoast/ui-library";
import { DangerModal, ModalDescription, Actions, CloseButton } from "../../shared-admin/components/danger-modal";
import { STORE_NAME } from "../constants";

/**
 * The update modal shown when a Free user has the Premium version that is not supported for AI bulk actions.
 *
 * @param {Object} props The props.
 * @param {Function} props.onClose The callback to close the modal.
 * @param {boolean} props.isOpen Whether the modal is open.
 *
 * @returns {JSX.Element} The update modal.
 */
export const UpdateModal = ( { onClose, isOpen } ) => {
	const ariaProps = useSvgAria();
	const premiumUpdateUrl = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "premiumUpdateUrl", "" ) );
	return (
		<DangerModal isOpen={ isOpen } onClose={ onClose } title={ __( "Your plugin needs an update", "wordpress-seo" ) }>
			<ModalDescription>
				{ sprintf(
					/** translators: %s: plugin name */
					__( "To use AI features, please update %s to the latest version.", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</ModalDescription>
			<Actions>
				<CloseButton onClick={ onClose } />
				<Button
					id="yst-bulk-editor-update-modal"
					className="yst-pe-2.5 yst-flex yst-gap-1.5 yst-items-center"
					href={ premiumUpdateUrl }
					target="_blank"
					rel="noopener noreferrer"
					as="a"
				>
					{ __( "Update now", "wordpress-seo" ) }
					<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
					<ArrowNarrowRightIcon className="yst-h-4 yst-w-4 rtl:yst-rotate-180 yst-shrink-0" { ...ariaProps } />
				</Button>
			</Actions>
		</DangerModal>
	);
};
