import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { noop } from "lodash";
import { Body, title } from "./messages/seo-analysis-inactive";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The SEO-analysis-inactive error (SEO_ANALYSIS_INACTIVE) as a danger modal.
 * Its "Refresh page" action reloads once the user has enabled the analysis.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const SeoAnalysisInactiveModal = ( { isOpen = true, onClose = noop } ) => {
	const handleRefresh = useCallback( () => window.location.reload(), [] );

	return (
		<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
			<ModalDescription><Body /></ModalDescription>
			<Actions>
				<CloseButton onClose={ onClose } />
				<Button variant="primary" onClick={ handleRefresh }>
					{ __( "Refresh page", "wordpress-seo" ) }
				</Button>
			</Actions>
		</DangerModal>
	);
};
