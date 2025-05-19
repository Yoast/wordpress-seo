import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, useCallback, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { UsageCounter } from "@yoast/ai-frontend";
import { Badge, Link, Modal, useSvgAria, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import { focusFocusKeyphraseInput, isConsideredEmpty } from "../helpers";
import { useLocation, useMeasuredRef, useModalTitle, useTypeContext } from "../hooks";
import { FeatureError } from "./feature-error";
import { Introduction } from "./introduction";
import { UpsellModalContent } from "./upsell-modal-content";
import { ModalContent } from "./modal-content";

/**
 * Checks whether all required subscriptions are valid.
 *
 * @param {string} postType The post type.
 * @param {boolean} hasValidPremiumSubscription Whether the Yoast SEO Premium subscription is valid.
 * @param {boolean} hasValidWooSubscription Whether the Yoast WooCommerce SEO subscription is valid.
 * @param {boolean} isSeoAnalysisActive Whether the SEO analysis feature is active.
 * @param {boolean} isWooCommerceActive Whether the WooCommerce plugin is active.
 * @returns {boolean} whether all required subscriptions are valid.
 */

/**
 * @param {function} onUseAi Callback for when the user clicks on the use AI button.
 * @returns {JSX.Element} The element.
 */
export const App = ( { onUseAi } ) => {
	const { editType } = useTypeContext();
	const location = useLocation();
	const title = useModalTitle();
	const [ isModalOpen, , , openModal, closeModal ] = useToggleState( false );
	const focusElementRef = useRef( null );
	const focusKeyphrase = useSelect( select => select( STORE_NAME_EDITOR ).getFocusKeyphrase(), [] );
	const aiModalHelperLink = useSelect( select => select( STORE_NAME_EDITOR )
		.selectLink( "https://yoa.st/ai-generator-help-button-modal" ), [] );
	const { closeEditorModal } = useDispatch( STORE_NAME_EDITOR );
	const hasConsent = useSelect( select => select( STORE_NAME_AI ).selectHasAiGeneratorConsent(), [] );
	const [ tryAi, setTryAi ] = useState( hasConsent );

	const promptContentInitialized = useSelect( select => select( STORE_NAME_AI ).selectPromptContentInitialized(), [] );
	const currentSubscriptions = useSelect( select => select( STORE_NAME_AI ).selectProductSubscriptions(), [] );
	const isSeoAnalysisActive = useSelect( select => select( STORE_NAME_EDITOR ).getPreference( "isKeywordAnalysisActive", true ), [] );

	/* translators: Hidden accessibility text. */
	const closeButtonScreenReaderText = __( "Close modal", "wordpress-seo" );
	const svgAriaProps = useSvgAria();
	const [ panelHeight, setPanelHeight ] = useState( 0 );
	const handlePanelMeasureChange = useCallback( entry => setPanelHeight( entry.borderBoxSize[ 0 ].blockSize ), [ setPanelHeight ] );
	const panelRef = useMeasuredRef( handlePanelMeasureChange );

	const arePreconditionsMet = isSeoAnalysisActive;

	const MainModalCommonProps = {
		onClose: closeModal,
		aiModalHelperLink,
		svgAriaProps,
		panelRef,
		closeButtonScreenReaderText,
		title,
	};

	const checkFocusKeyphrase = useCallback( () => {
		if ( isConsideredEmpty( focusKeyphrase ) ) {
			closeModal();
			closeEditorModal();
			// Give JS time to close the modals (with focus traps) before trying to focus the input field.
			setTimeout( () => focusFocusKeyphraseInput( location ), 0 );
			return;
		}
		openModal();
	}, [ focusKeyphrase, openModal, closeModal, closeEditorModal, location ] );

	const handleStartGenerating = useCallback( () => {
		if ( isSeoAnalysisActive ) {
			checkFocusKeyphrase();
		} else {
			// At this point in the execution, the AiModalContent contains the SeoAnalysisInactiveError.
			openModal();
		}
	}, [ checkFocusKeyphrase, isSeoAnalysisActive, openModal ] );

	const handleUseAi = useCallback( () => {
		onUseAi();
		openModal();
		if ( hasConsent && isSeoAnalysisActive ) {
			// Check the focus keyphrase when we have consent and the focus keyphrase is present.
			checkFocusKeyphrase();
		}
	}, [ onUseAi, openModal, hasConsent, isSeoAnalysisActive, checkFocusKeyphrase ] );

	return (
		<Fragment>
			<button
				type="button"
				id={ `yst-replacevar__use-ai-button__${ editType }__${ location }` }
				className="yst-replacevar__use-ai-button"
				onClick={ handleUseAi }
				disabled={ ! promptContentInitialized }
			>
				{ __( "Use AI", "wordpress-seo" ) }
			</button>
			{ isModalOpen && <Fragment>
				<Modal
					className="yst-introduction-modal"
					isOpen={ ! hasConsent && arePreconditionsMet }
					onClose={ closeModal }
					initialFocus={ focusElementRef }
				>
					<Modal.Panel
						className="yst-max-w-lg yst-p-0 yst-rounded-3xl"
						closeButtonScreenReaderText={ closeButtonScreenReaderText }
					>
						{ /* WIP:
						 * Check if user is premium show directly Introduction and it's not a product page.
						 * If user is free and didn't grant consent show the upsell.
						 * If user is free and granted consent show the introduction.
						 * If user is premium and and it's a product page but user has no woo seo and didn't grant consent then show the upsell.
						 * If user is premium and and it's a product page but user has woo seo and didn't grant consent then show the introduction.
						 */ }

						{ tryAi ? <Introduction
							onStartGenerating={ handleStartGenerating }
							focusElementRef={ focusElementRef }
						/> : <UpsellModalContent setTryAi={ setTryAi } /> }
					</Modal.Panel>
				</Modal>

				<MainModal
					{ ...MainModalCommonProps }
					isOpen={ arePreconditionsMet && hasConsent }
				>
					<ModalContent height={ panelHeight } />
				</MainModal>

				<MainModal
					{ ...MainModalCommonProps }
					isOpen={ ! arePreconditionsMet }
				>
					<FeatureError currentSubscriptions={ currentSubscriptions } isSeoAnalysisActive={ isSeoAnalysisActive } />
				</MainModal>
			</Fragment> }
		</Fragment>
	);
};
App.propTypes = {
	onUseAi: PropTypes.func.isRequired,
};


/**
 * Component abstracting the main modal.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {func} onClose Callback for when the modal is closed.
 * @param {func} panelRef The reference to the panel.
 * @param {string} closeButtonScreenReaderText The screen reader text for the close button.
 * @param {string} title The title of the modal.
 * @param {string} aiModalHelperLink The link to the AI modal helper.
 * @param {object} svgAriaProps The SVG aria properties.
 * @param {JSX.Node} children The children of the modal.
 *
 * @returns {JSX.Element} The main modal.
 */
const MainModal = ( { isOpen, onClose, panelRef, closeButtonScreenReaderText, title, aiModalHelperLink, svgAriaProps, children } ) => {
	const { counts, limit } = useSelect( ( select ) => ( {
		counts: select( STORE_NAME_AI ).selectUsageCount(),
		limit: select( STORE_NAME_AI ).selectUsageCountLimit(),
	} ), [] );

	return (
		<Modal
			className="yst-ai-modal"
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel ref={ panelRef } className="yst-max-w-3xl yst-relative" closeButtonScreenReaderText={ closeButtonScreenReaderText }>
				<Modal.Container>
					<Modal.Container.Header>
						<UsageCounter
							limit={ limit }
							requests={ counts }
							isSkeleton={ false }
							className={ "yst-absolute yst-top-[-11px] yst-end-12 sm:yst-end-16" }
						/>
						<div className="yst-flex yst-items-center">
							<span className="yst-logo-icon yst-h-5 yst-w-5" />
							<Modal.Title className="yst-ms-3 yst-me-1.5" as="h1" size="2">{ title }</Modal.Title>
							<Link
								id="ai-modal-learn-more"
								href={ aiModalHelperLink }
								variant="primary"
								className="yst-no-underline yst-me-2"
								target="_blank"
								rel="noopener"
								/* translators: Hidden accessibility text. */
								aria-label={ __( "Learn more about AI (Opens in a new browser tab)", "wordpress-seo" ) }
							>
								<QuestionMarkCircleIcon { ...svgAriaProps } className={ "yst-w-4 yst-h-4 yst-text-slate-500" } />
							</Link>
							<Badge variant="info">{ __( "Beta", "wordpress-seo" ) }</Badge>
						</div>
						<hr className="yst-mt-6 yst--mx-6" />
					</Modal.Container.Header>
					{ children }
				</Modal.Container>
			</Modal.Panel>
		</Modal>
	);
};

MainModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	panelRef: PropTypes.func.isRequired,
	closeButtonScreenReaderText: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	aiModalHelperLink: PropTypes.string.isRequired,
	svgAriaProps: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
};
