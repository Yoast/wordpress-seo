import { __ } from "@wordpress/i18n";
import { useCallback, useRef, useState } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { AIFixesButton } from "@yoast/components";
import { SparklesIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { Modal } from "@yoast/ui-library";
import { ModalContent } from "../../ai-generator/components/modal-content";

/**
 * The AI Assessment Fixes button component.
 *
 * @param {string} id The assessment ID for which the AI fixes should be applied to.
 * @param {boolean} isPressed Whether the AI Assessment fixes button is pressed or not.
 * @param {boolean} isPremium Whether the premium add-on is active or not.
 * @returns {JSX.Element} The AI Assessment Fixes button.
 */
const AIAssessmentFixesButton = ( { id, isPressed, isPremium } ) => {
	const aiFixesId = id + "AIFixes";
	const ariaLabel = __( "Fix this result with AI", "wordpress-seo" );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const closeModal = useCallback( () => setIsModalOpen( false ), [] );
	const openModal = useCallback( () => setIsModalOpen( true ), [] );

	const handleClick = useCallback( () => {
		if ( isPremium ) {
			doAction( "yoast.ai.fixAssessments", id );
		} else {
			openModal();
		}
	}, [] );
	const focusElementRef = useRef( null );

	return (
		<>
			<AIFixesButton
				onClick={ handleClick }
				ariaLabel={ ariaLabel }
				id={ aiFixesId }
				className={ "yoast-tooltip yoast-tooltip-w" }
				isPressed={ isPressed }
			>
				<SparklesIcon style={ { width: "70%", height: "70%", color: "#555" } } />
				{
					// We put the logic for the Upsell component in place.
					// The Modal below is only a placeholder/mock. When we have the design for the real upsell, the modal should be replaced.
					isModalOpen && <Modal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ closeModal } initialFocus={ focusElementRef }>
						<Modal.Panel className="yst-max-w-lg yst-p-0 yst-rounded-3xl yst-introduction-modal-panel">
							<ModalContent onClose={ closeModal } focusElementRef={ focusElementRef } />
						</Modal.Panel>
					</Modal>
				}
			</AIFixesButton>
		</>
	);
};

AIAssessmentFixesButton.propTypes = {
	id: PropTypes.string.isRequired,
	isPressed: PropTypes.bool.isRequired,
	isPremium: PropTypes.bool,
};

AIAssessmentFixesButton.defaultProps = {
	isPremium: false,
};

export default AIAssessmentFixesButton;

