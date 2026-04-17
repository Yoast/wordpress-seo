import { Fragment } from "@wordpress/element";
import { Transition } from "@headlessui/react";
import { Modal, useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { SuggestionButtonSkeleton } from "./suggestion-button";
import { SuggestionsList } from "./suggestion-list";
import { ReactComponent as Yoast } from "../../../images/yoast.svg";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * The loading content for the ContentSuggestionsModal.
 *
 * @returns {JSX.Element} The loading content for the ContentSuggestionsModal.
 */
const LoadingSuggestionsModalContent = () => {
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
 * Renders the modal content with or without transition animations.
 *
 * @param {Object} props The component props.
 * @param {string} props.status The current status of the modal.
 * @param {Suggestion[]} props.suggestions The list of content suggestions to display.
 * @param {Function} props.onSuggestionClick The function to call when a suggestion is clicked.
 * @param {boolean} props.skipTransitions Whether to skip transition animations.
 *
 * @returns {JSX.Element} The ModalContent component.
 */
export const SuggestionsModalContent = ( { status, suggestions, onSuggestionClick, skipTransitions } ) => {
	const isLoading = status === ASYNC_ACTION_STATUS.loading;
	const isSuccess = status === ASYNC_ACTION_STATUS.success;

	if ( skipTransitions ) {
		return (
			<div aria-live="polite">
				{ isLoading && <LoadingSuggestionsModalContent /> }
				{ isSuccess && <SuggestionsList suggestions={ suggestions } onSuggestionClick={ onSuggestionClick } /> }
			</div>
		);
	}

	return (
		// yst-relative enables absolute positioning of the leaving element to prevent layout stacking during cross-fade.
		<div className="yst-relative" aria-live="polite">
			<Transition
				as="div"
				show={ isLoading }
				enter="yst-transition-opacity yst-duration-300"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				leave="yst-transition-opacity yst-duration-300 yst-absolute yst-top-0 yst-left-0 yst-right-0"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<div><LoadingSuggestionsModalContent /></div>
			</Transition>
			{ /*
			 * yst-delay-300 matches the loading content's leave duration (yst-duration-300)
			 * so the suggestions only fade in after the loading content has faded out.
			 */ }
			<Transition
				as={ Fragment }
				show={ isSuccess }
				enter="yst-transition-opacity yst-duration-300 yst-delay-300"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				leave="yst-transition-opacity yst-duration-300"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<SuggestionsList suggestions={ suggestions } onSuggestionClick={ onSuggestionClick } />
			</Transition>
		</div>
	);
};
