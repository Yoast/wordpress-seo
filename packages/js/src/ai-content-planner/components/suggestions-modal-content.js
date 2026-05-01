import { Modal, useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as Yoast } from "../../../images/yoast.svg";
import { noop } from "lodash";
import { Transition } from "@headlessui/react";
import { ContentPlannerError } from "./content-planner-error";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { useFetchContentSuggestions } from "../hooks";
import { SuggestionsList } from "./suggestion-list";
import { LoadingSuggestionButton } from "./suggestion-button";
import { useState, useEffect, useRef } from "@wordpress/element";

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
	const [ textIndex, setTextIndex ] = useState( 0 );
	const [ textVisible, setTextVisible ] = useState( true );

	const loadingTexts = [
		__( "Analyzing your site content…", "wordpress-seo" ),
		__( "Composing your content suggestions…", "wordpress-seo" ),
		__( "Writing compelling headlines…", "wordpress-seo" ),
	];

	const timeoutRef = useRef( null );
	useEffect( () => {
		const interval = setInterval( () => {
			setTextVisible( false );
			timeoutRef.current = setTimeout( () => {
				setTextIndex( ( prev ) => ( prev + 1 ) % loadingTexts.length );
				setTextVisible( true );
			}, 300 );
		}, 3000 );
		return () => {
			clearInterval( interval );
			clearTimeout( timeoutRef.current );
		};
	}, [] );

	return (
		<>
			<div className="yst-flex yst-flex-col yst-items-center yst-pb-8">
				<Yoast
					className="yst-w-24 yst-mb-2 yst-transition-colors yst-duration-700 yst-text-primary-500"
					{ ...svgAriaProps }
				/>
				<Modal.Description
					className={ `yst-italic yst-text-slate-500 yst-transition-opacity yst-duration-300 ${ textVisible ? "yst-opacity-100" : "yst-opacity-0" }` }
				>
					<span className="yst-sr-only"> Yoast </span>
					{ loadingTexts[ textIndex ] }
				</Modal.Description>
			</div>
			<div className="yst-relative">
				{ [ ...Array( 5 ) ].map( ( _, index ) => <LoadingSuggestionButton key={ index } /> ) }
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
 * ContentSuggestionsModal component.
 *
 * @param {Object} props The component props.
 * @param {string} props.status The current modal status.
 * @param {Function} props.onSuggestionClick The function to call when a suggestion is clicked.
 * @param {Suggestion[]} props.suggestions The list of content suggestions to display.
 * @param {Object|null} props.error The error object if the request failed, or null if there is no error.
 * @param {Object} props.closeButtonRef The ref for the close button element.

 *
 * @returns {JSX.Element} The SuggestionsModalContent component.
 */
export const SuggestionsModalContent = ( {
	status,
	onSuggestionClick = noop,
	suggestions,
	error,
	closeButtonRef,
} ) => {
	const fetchContentSuggestions = useFetchContentSuggestions();
	const isLoading = status === ASYNC_ACTION_STATUS.loading;
	const isSuccess = status === ASYNC_ACTION_STATUS.success;

	useEffect( () => {
		if ( closeButtonRef?.current ) {
			closeButtonRef.current.focus();
		}
	}, [ isLoading ] );

	return (
		<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
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
					<LoadingSuggestionsModalContent />
				</Transition>
				{ /*
					* yst-delay-300 matches the loading content's leave duration (yst-duration-300)
					* so the suggestions only fade in after the loading content has faded out.
					*/ }
				<Transition
					as="div"
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
				{ status === ASYNC_ACTION_STATUS.error && <ContentPlannerError
					errorCode={ error.errorCode }
					errorIdentifier={ error.errorIdentifier }
					errorMessage={ error.errorMessage }
					missingLicenses={ error.missingLicenses }
					onRetry={ fetchContentSuggestions }
				/> }
			</div>
		</Modal.Container.Content>
	);
};
