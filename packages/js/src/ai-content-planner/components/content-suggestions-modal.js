import { Badge, Link, Modal, SkeletonLoader, useSvgAria } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { ReactComponent as Yoast } from "../../../images/yoast.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { noop } from "lodash";
import { Fragment, useRef, useEffect, useCallback } from "@wordpress/element";
import { Transition } from "@headlessui/react";
import { ContentPlannerError } from "./content-planner-error";
import { IntentBadge } from "./intent-badge";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Suggestion button component.
 *
 * @param {object} props The component props.
 * @param {Suggestion} props.suggestion The full suggestion object.
 * @param {Function} props.onClick The function to call when the suggestion button is clicked.
 *
 * @returns {JSX.Element} The SuggestionButton component.
 */
const SuggestionButton = ( { suggestion, onClick } ) => {
	const { intent, title, explanation } = suggestion;
	const handleClick = useCallback( () => onClick( suggestion ), [ onClick, suggestion ] );
	return (
		<button type="button" onClick={ handleClick } className="yst-text-start yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm focus:yst-outline focus:yst-outline-2 focus:yst-outline-offset-2 focus:yst-outline-primary-500">
			<IntentBadge intent={ intent } className="yst-mb-2" />
			<div className="yst-font-medium yst-text-sm yst-mb-2 yst-text-slate-800">{ title }</div>
			<p className="yst-text-slate-600">{ explanation }</p>
		</button>
	);
};

/**
 * Loading skeleton for the SuggestionButton component.
 *
 * @returns {JSX.Element} The SuggestionButtonSkeleton component.
 */
const SuggestionButtonSkeleton = () => (
	<div className="yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm">
		<div className="yst-px-2 yst-py-1 yst-bg-white yst-inline-flex yst-gap-1 yst-items-center yst-justify-start yst-mb-2 yst-rounded-3xl yst-border yst-border-slate-300">
			<SkeletonLoader className="yst-w-2 yst-h-2 yst-rounded-full" />
			<SkeletonLoader className="yst-w-20 yst-h-3 yst-rounded" />
		</div>
		<SkeletonLoader className="yst-w-64 yst-h-[18px] yst-rounded yst-mb-3" />
		<SkeletonLoader className="yst-w-full yst-h-[13px] yst-rounded yst-mb-2" />
		<SkeletonLoader className="yst-w-2/3 yst-h-[13px] yst-rounded" />
	</div>
);

/**
 * The loading content for the ContentSuggestionsModal.
 *
 * @returns {JSX.Element} The loading content for the ContentSuggestionsModal.
 */
const LoadingModalContent = () => {
	const svgAriaProps = useSvgAria();
	return (
		<>
			<div className="yst-flex yst-flex-col yst-items-center yst-pb-8">
				<Yoast className="yst-w-24 yst-text-primary-300 yst-mb-2" { ...svgAriaProps } />
				<Modal.Description className="yst-italic yst-text-slate-500">
					<span className="yst-sr-only"> Yoast </span>
					{ __( "Analyzing your site content…", "wordpress-seo" ) }</Modal.Description>
			</div>
			<div className="yst-relative">
				{ [ ...Array( 5 ) ].map( ( _, index ) => <SuggestionButtonSkeleton key={ index } /> ) }
				{ /* gradient overlay to create a fade effect at the bottom of the modal content */ }
				<div
					className="yst-absolute yst-inset-0 yst-bg-gradient-to-t yst-from-white yst-to-transparent yst-transition-opacity"
					aria-hidden="true"
				/>
			</div>
		</>
	);
};

/**
 * Renders the error content for the ContentSuggestionsModal.
 *
 * @param {Object}   props         The component props.
 * @param {Object}   props.error   The error object.
 * @param {Function} props.onRetry The function to call when the user clicks "Try again".
 *
 * @returns {JSX.Element|null} The error content.
 */
const ErrorModalContent = ( { error, onRetry } ) => {
	if ( ! error ) {
		return null;
	}
	return (
		<ContentPlannerError
			errorCode={ error.errorCode }
			errorIdentifier={ error.errorIdentifier }
			errorMessage={ error.errorMessage }
			onRetry={ onRetry }
		/>
	);
};

/**
 * Renders the success content with suggestion buttons.
 *
 * @param {Object}       props                    The component props.
 * @param {Suggestion[]} props.suggestions         The list of suggestions.
 * @param {Function}     props.onSuggestionClick   Callback when a suggestion is clicked.
 *
 * @returns {JSX.Element} The success content.
 */
const SuccessModalContent = ( { suggestions, onSuggestionClick } ) => (
	<div>
		<Modal.Description className="yst-mb-4">
			{ __( "Select a suggestion to generate a structured outline for your post.", "wordpress-seo" ) }
		</Modal.Description>
		{ suggestions.map( ( suggestion, index ) => (
			<SuggestionButton
				key={ `suggestion-${ index }` }
				suggestion={ suggestion }
				onClick={ onSuggestionClick }
			/>
		) ) }
	</div>
);

/**
 * The body content for the ContentSuggestionsModal, with optional cross-fade transitions.
 *
 * @param {Object}       props                    The component props.
 * @param {string}       props.status             The current modal status.
 * @param {Suggestion[]} props.suggestions         The list of suggestions.
 * @param {Function}     props.onSuggestionClick   Callback when a suggestion is clicked.
 * @param {Object|null}  props.error              The error object.
 * @param {Function}     props.onRetry            Callback when the user clicks "Try again".
 * @param {boolean}      props.skipTransitions    Whether to skip transitions.
 *
 * @returns {JSX.Element} The body content.
 */
const ModalBodyContent = ( { status, suggestions, onSuggestionClick, error, onRetry, skipTransitions } ) => {
	if ( skipTransitions ) {
		return (
			<div aria-live="polite">
				{ status === ASYNC_ACTION_STATUS.loading && <LoadingModalContent /> }
				{ status === ASYNC_ACTION_STATUS.error && <ErrorModalContent error={ error } onRetry={ onRetry } /> }
				{ status === ASYNC_ACTION_STATUS.success && (
					<SuccessModalContent suggestions={ suggestions } onSuggestionClick={ onSuggestionClick } />
				) }
			</div>
		);
	}

	return (
		// yst-relative enables absolute positioning of the leaving element to prevent layout stacking during cross-fade.
		<div className="yst-relative" aria-live="polite">
			<Transition
				as={ Fragment }
				show={ status === ASYNC_ACTION_STATUS.loading }
				enter="yst-transition-opacity yst-duration-300"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				leave="yst-transition-opacity yst-duration-300 yst-absolute yst-top-0 yst-left-0 yst-right-0"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<div><LoadingModalContent /></div>
			</Transition>
			<Transition
				as={ Fragment }
				show={ status === ASYNC_ACTION_STATUS.error }
				enter="yst-transition-opacity yst-duration-300 yst-delay-300"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				leave="yst-transition-opacity yst-duration-300"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<div><ErrorModalContent error={ error } onRetry={ onRetry } /></div>
			</Transition>
			{ /*
			 * yst-delay-300 matches the loading content's leave duration (yst-duration-300)
			 * so the suggestions only fade in after the loading content has faded out.
			 */ }
			<Transition
				as={ Fragment }
				show={ status === ASYNC_ACTION_STATUS.success }
				enter="yst-transition-opacity yst-duration-300 yst-delay-300"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				leave="yst-transition-opacity yst-duration-300"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<div><SuccessModalContent suggestions={ suggestions } onSuggestionClick={ onSuggestionClick } /></div>
			</Transition>
		</div>
	);
};

/**
 * ContentSuggestionsModal component.
 *
 * @param {Object} props The component props.
 * @param {string} props.status The current modal status.
 * @param {boolean} props.isPremium Whether the user has a premium add-on activated or not.
 * @param {Function} props.onSuggestionClick The function to call when a suggestion is clicked.
 * @param {Suggestion[]} props.suggestions The list of content suggestions to display.
 * @param {boolean} props.skipTransitions Whether to skip transition animations.
 * @param {number} props.usageCount The usage count for the content suggestions feature.
 * @param {number} props.usageCountLimit The maximum usage count.
 * @param {Object|null} props.error The error object when in error state.
 * @param {Function} props.onRetry The function to call when the user clicks "Try again".
 *
 * @returns {JSX.Element} The ContentSuggestionsModal component.
 */
export const ContentSuggestionsModal = ( {
	status,
	isPremium,
	onSuggestionClick = noop,
	suggestions,
	skipTransitions = false,
	usageCount,
	usageCountLimit,
	error,
	onRetry,
} ) => {
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );
	const aiHelpLink = useSelect(
	// Temporary link to the AI Generator help button modal until the Content Planner help shortlink is created.
		( select ) => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/ai-generator-help-button-modal" ), []
	);

	useEffect( () => {
		closeButtonRef.current?.focus();
	}, [ status ] );

	return (
		<Modal.Panel
			className="yst-p-0 yst-max-w-2xl"
			hasCloseButton={ false }
		>
			<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close content suggestions modal", "wordpress-seo" ) } />
			<Modal.Container>
				<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
					<YoastIcon className="yst-fill-primary-500 yst-w-4" { ...svgAriaProps } />
					<Modal.Title size="2">{ __( "Content suggestions", "wordpress-seo" ) }</Modal.Title>
					<Link
						href={ aiHelpLink }
						variant="primary"
						className="yst-no-underline"
						target="_blank"
						rel="noopener"
						aria-label={ __( "Learn more about AI (Opens in a new browser tab)", "wordpress-seo" ) }
					>
						<QuestionMarkCircleIcon { ...svgAriaProps } className="yst-w-4 yst-h-4 yst-text-slate-500 yst-shrink-0" />
					</Link>
					<Badge size="small">{ __( "Beta", "wordpress-seo" ) }</Badge>
					<span className="yst-flex-grow" />
					{ status !== ASYNC_ACTION_STATUS.error && (
						<UsageCounter
							limit={ usageCountLimit }
							requests={ usageCount }
							mentionBetaInTooltip={ isPremium }
							mentionResetInTooltip={ isPremium }
						/>
					) }
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
					<ModalBodyContent
						status={ status }
						suggestions={ suggestions }
						onSuggestionClick={ onSuggestionClick }
						error={ error }
						onRetry={ onRetry }
						skipTransitions={ skipTransitions }
					/>
				</Modal.Container.Content>
			</Modal.Container>
		</Modal.Panel>
	);
};
