import { Fill } from "@wordpress/components";
import { select } from "@wordpress/data";
import { useCallback, useRef } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import { Modal, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ModalContent } from "./components/modal-content";

/**
 * The AI Generator upsell button and modal.
 *
 * @param {string} fieldId The field ID.
 *
 * @returns {JSX.Element} The AI Generator upsell button and modal.
 */
const AiGeneratorUpsell = ( { fieldId } ) => {
	const [ isModalOpen, , , setIsModalOpenTrue, setIsModalOpenFalse ] = useToggleState( false );
	const handleClick = useCallback( () => {
		setIsModalOpenTrue();
	}, [ setIsModalOpenTrue ] );
	const focusElementRef = useRef( null );

	return (
		<>
			<button
				type="button"
				id={ `yst-replacevar__use-ai-button__${ fieldId }` }
				className="yst-replacevar__use-ai-button-upsell"
				onClick={ handleClick }
			>
				{ __( "Use AI", "wordpress-seo" ) }
			</button>
			<Modal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ setIsModalOpenFalse } initialFocus={ focusElementRef }>
				<Modal.Panel className="yst-max-w-lg yst-p-0 yst-rounded-3xl">
					<ModalContent onClose={ setIsModalOpenFalse } focusElementRef={ focusElementRef } />
				</Modal.Panel>
			</Modal>
		</>
	);
};

AiGeneratorUpsell.propTypes = {
	fieldId: PropTypes.string.isRequired,
};

const STORE = "yoast-seo/editor";

/**
 * Initializes the AI Generator upsell.
 *
 * @returns {void}
 */
const initializeAiGenerator = () => {
	const isPremium = select( STORE ).getIsPremium();
	const isWooSeoUpsellPost = select( STORE ).getIsWooSeoUpsell();
	const isWooSeoUpsellTerm = select( STORE ).getIsWooSeoUpsellTerm();
	const shouldShowAiGeneratorUpsell = ! isPremium || isWooSeoUpsellPost || isWooSeoUpsellTerm;

	addFilter(
		"yoast.replacementVariableEditor.additionalButtons",
		"yoast/yoast-seo-premium/AiGenerator",
		( buttons, { fieldId } ) => {
			if ( shouldShowAiGeneratorUpsell ) {
				buttons.push(
					<Fill name={ `yoast.replacementVariableEditor.additionalButtons.${ fieldId }` }>
						<AiGeneratorUpsell fieldId={ fieldId } />
					</Fill>
				);
			}
			return buttons;
		}
	);
};

export default initializeAiGenerator;
