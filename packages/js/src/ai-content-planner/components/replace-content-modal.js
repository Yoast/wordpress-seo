import { ExclamationIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useRef, useEffect } from "@wordpress/element";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";

/**
 * Confirmation panel shown before replacing post content with the generated outline.
 * Renders inside a parent Modal (managed by FeatureModal).
 *
 * @param {Function} onClose    The function to call when the user cancels (goes back to the outline).
 * @param {Function} onConfirm  The function to call when the user confirms replacing content.
 *
 * @returns {JSX.Element} The ReplaceContentModal component.
 */
export const ReplaceContentModal = ( { onClose, onConfirm } ) => {
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );

	// Focus the close button on mount so screen readers announce the dialog context.
	useEffect( () => {
		closeButtonRef.current?.focus();
	}, [] );

	return (
		<Modal.Panel hasCloseButton={ false }>
			<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close replace content confirmation", "wordpress-seo" ) } />
			<div className="yst-flex yst-items-start">
				<div className="yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-10 yst-w-10 yst-rounded-full yst-bg-red-100">
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
				</div>
				<div className="yst-ms-4 yst-text-start">
					<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
						{ __( "Replace existing content with this outline?", "wordpress-seo" ) }
					</Modal.Title>
					<Modal.Description className="yst-text-sm yst-text-slate-500">
						{ __( "This will replace everything in your post with the generated outline and content notes. You can revert this action by clicking the 'undo' button in the Gutenberg editor.", "wordpress-seo" ) }
					</Modal.Description>
				</div>
			</div>
			<div className="yst-flex yst-flex-row yst-justify-end yst-gap-3 yst-mt-6">
				<Button type="button" variant="secondary" onClick={ onClose }>
					{ __( "Cancel", "wordpress-seo" ) }
				</Button>
				<Button type="button" variant="error" onClick={ onConfirm }>
					{ __( "Replace content", "wordpress-seo" ) }
				</Button>
			</div>
		</Modal.Panel>
	);
};
