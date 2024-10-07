import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import { useBlocker } from "react-router-dom";
import { Modal, Button, useSvgAria } from "@yoast/ui-library";
import { ExclamationIcon } from "@heroicons/react/outline";

/**
 * The unsaved changes modal.
 *
 * @returns {JSX.Element} The unsaved changes modal.
 */
export const UnsavedChangesModal = () => {
	const svgAriaProps = useSvgAria();

	const blocker = useBlocker( ( { currentLocation, nextLocation } ) =>{
		const isStepBeingEdited = get( window, "isStepBeingEdited", false );
		return isStepBeingEdited && currentLocation.pathname === "/first-time-configuration" && nextLocation.pathname !== "/first-time-configuration";
	} );

	return <Modal isOpen={ blocker.state === "blocked" } onClose={ blocker.reset }>
		<Modal.Panel closeButtonScreenReaderText={ __( "Close", "wordpress-seo" ) }>
			<div className="sm:yst-flex sm:yst-items-start">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
				</div>
				<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ml-4 sm:yst-text-left">
					<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
						{ __( "Unsaved changes", "wordpress-seo" ) }
					</Modal.Title>
					<Modal.Description className="yst-text-sm yst-text-slate-500">
						{ __( "There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" ) }
					</Modal.Description>
				</div>
			</div>
			<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
				<Button type="button" variant="error" onClick={ blocker.proceed } className="yst-block">
					{ __( "Yes, leave page", "wordpress-seo" ) }
				</Button>
				<Button type="button" variant="secondary" onClick={ blocker.reset } className="yst-block">
					{ __( "No, continue editing", "wordpress-seo" ) }
				</Button>
			</div>
		</Modal.Panel>
	</Modal>;
};
