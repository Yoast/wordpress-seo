
import { Button, Modal, SkeletonLoader, TextField, TextareaField } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { useState, useCallback, useEffect } from "@wordpress/element";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { ContentPlannerError } from "./content-planner-error";
import classNames from "classnames";
import { IntentCallout } from "./intent-callout";
import { StructureRow } from "./structure-row";
import { CategorySection } from "./category-section";
import { getProgressColor } from "../helpers/get-progress-color";
import { META_DESCRIPTION_MAX_LENGTH } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { useDraggableStructure, useFetchContentOutline } from "../hooks";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Progress bar indicating the meta description character length.
 *
 * @param {string} value The meta description text.
 *
 * @returns {JSX.Element} The MetaDescriptionProgressBar component.
 */
const MetaDescriptionProgressBar = ( { value } ) => {
	const length = value ? value.length : 0;
	const percentage = Math.min( ( length / META_DESCRIPTION_MAX_LENGTH ) * 100, 100 );

	return (
		<div className="yst-w-full yst-h-2 yst-bg-slate-200 yst-rounded-full yst-overflow-hidden" aria-hidden="true">
			<div
				className="yst-h-full yst-rounded-full yst-transition-all yst-duration-300"
				style={ { width: `${ percentage }%`, backgroundColor: getProgressColor( length ) } }
			/>
		</div>
	);
};

/**
 * Skeleton form field with a real label and a skeleton value.
 *
 * @param {string}  label     The field label.
 * @param {boolean} [multiline=false] Whether to render a taller skeleton area.
 *
 * @returns {JSX.Element} The SkeletonFormField component.
 */
const SkeletonFormField = ( { label, multiline = false } ) => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<span className="yst-font-medium yst-text-sm yst-text-slate-800">{ label }</span>
		<div
			className={ classNames(
				"yst-bg-white yst-border yst-border-slate-300 yst-rounded-md yst-shadow-sm yst-px-3 yst-py-2",
				multiline ? "yst-min-h-20 yst-flex yst-flex-col yst-gap-1" : "yst-h-10 yst-flex yst-items-center"
			) }
		>
			{ multiline ? (
				<>
					<SkeletonLoader className="yst-w-full yst-h-4 yst-rounded" />
					<SkeletonLoader className="yst-w-full yst-h-4 yst-rounded" />
					<SkeletonLoader className="yst-w-1/2 yst-h-4 yst-rounded" />
				</>
			) : (
				<SkeletonLoader className="yst-w-1/3 yst-h-4 yst-rounded" />
			) }
		</div>
	</div>
);

/**
 * @typedef {Object} StructureItem
 * @property {string} level The heading level (e.g. "H2") or type indicator (e.g. a list icon).
 * @property {string} title The section title.
 */

/**
 * Loading content Outline Modal Content.
 *
 * @returns {JSX.Element} The LoadingOutlineModalContent component.
 */
const LoadingOutlineModalContent = () => {
	return <>
		<CategorySection
			isLoading={ true }
			onToggle={ noop }
		/>
		<div className="yst-flex yst-flex-col yst-gap-4">
			<SkeletonFormField label={ __( "Focus Keyphrase", "wordpress-seo" ) } />
			<SkeletonFormField label={ __( "Title", "wordpress-seo" ) } />
			<SkeletonFormField label={ __( "Meta description", "wordpress-seo" ) } multiline={ true } />
		</div>
	</>;
};

/**
 * Content Outline Modal panel component.
 * Renders inside a parent Modal (managed by FeatureModal).
 *
 * @param {string}             status              The loading status of the content outline suggestion.
 * @param {Function}           onBackToSuggestions The function to call to go back to content suggestions.
 * @param {Function}           onApplyOutline      The function to call to add the outline to the post.
 * @param {OutlineSuggestion}  suggestion          The content outline suggestion to display.
 * @param {boolean}            isActive            Whether this panel is currently visible (used for focus management).
 * @param {Object|null}        error               The error object if the content outline failed to load, or null if there is no error.
 * @param {Function}           onRetry             The function to call to retry fetching the content outline.
 * @param {Object}             closeButtonRef      Ref object for the modal close button, used to manage focus.
 *
 * @returns {JSX.Element} The OutlineModalContent component.
 */
export const OutlineModalContent = ( {
	status,
	error,
	suggestion,
	onBackToSuggestions,
	onApplyOutline,
} ) => {
	const isLoading = status === ASYNC_ACTION_STATUS.loading;
	const fetchContentOutline = useFetchContentOutline();
	const handleRetry = useCallback( () => fetchContentOutline( suggestion ), [ fetchContentOutline, suggestion ] );
	const [ isCategoryEnabled, setIsCategoryEnabled ] = useState( true );

	const [ focusKeyphrase, setFocusKeyphrase ] = useState( suggestion.keyphrase );
	const [ title, setTitle ] = useState( suggestion.title );

	const [ metaDescription, setMetaDescription ] = useState( suggestion.meta_description );

	const {
		structure,
		dragOverIndex,
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleDragEnd,
		handleMoveUp,
		handleMoveDown,
	} = useDraggableStructure();

	useEffect( () => {
		setFocusKeyphrase( suggestion.keyphrase );
		setTitle( suggestion.title );
		setMetaDescription( suggestion.meta_description );
	}, [ suggestion ] );

	const handleFocusKeyphraseChange = useCallback( ( e ) => setFocusKeyphrase( e.target.value ), [] );
	const handleTitleChange = useCallback( ( e ) => setTitle( e.target.value ), [] );
	const handleMetaDescriptionChange = useCallback( ( e ) => setMetaDescription( e.target.value ), [] );

	const handleCategoryToggle = useCallback( () => {
		setIsCategoryEnabled( ( prev ) => ! prev );
	}, [] );

	const handleBackToSuggestions = useCallback( () => {
		// eslint-disable-next-line camelcase
		onBackToSuggestions( { ...suggestion, title, keyphrase: focusKeyphrase, meta_description: metaDescription }, structure );
	}, [ onBackToSuggestions, suggestion, title, focusKeyphrase, metaDescription, structure ] );

	const handleApplyOutline = useCallback( () => {
		onApplyOutline( {
			title,
			metaDescription,
			focusKeyphrase,
			category: isCategoryEnabled ? suggestion.category : null,
			structure,
		} );
	}, [ onApplyOutline, title, metaDescription, focusKeyphrase, isCategoryEnabled, suggestion.category, structure ] );

	if ( status === ASYNC_ACTION_STATUS.error ) {
		return (
			<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
				<ContentPlannerError
					errorCode={ error.errorCode }
					errorIdentifier={ error.errorIdentifier }
					errorMessage={ error.errorMessage }
					onRetry={ handleRetry }
				/>
			</Modal.Container.Content>
		);
	}

	return (
		<>
			<Modal.Container.Content className="yst-overflow-y-auto yst-pt-6 yst-px-6 yst-pb-0 yst-m-0 yst-relative" aria-busy={ isLoading }>
				<div className="yst-flex yst-flex-col yst-gap-6 yst-pb-4">
					<IntentCallout
						intent={ suggestion.intent }
						description={ suggestion.explanation }
					/>
					<Modal.Description className="yst-text-sm yst-text-slate-600">
						{ __( "Review and customize your content outline before adding it to your post", "wordpress-seo" ) }
					</Modal.Description>
					<hr className="yst-border-slate-200" />
					<Transition
						as="div"
						show={ isLoading }
						enter="yst-transition-opacity yst-duration-300 yst-delay-300"
						enterFrom="yst-opacity-0"
						enterTo="yst-opacity-100"
						leave="yst-transition-opacity yst-duration-300"
						leaveFrom="yst-opacity-100"
						leaveTo="yst-opacity-0"
					>
						<LoadingOutlineModalContent />
					</Transition>

					<Transition
						as="div"
						show={ ! isLoading }
						enter="yst-transition-opacity yst-duration-300 yst-delay-300"
						enterFrom="yst-opacity-0"
						enterTo="yst-opacity-100"
						leave="yst-transition-opacity yst-duration-300"
						leaveFrom="yst-opacity-100"
						leaveTo="yst-opacity-0"
					>
						{ suggestion.category  && (
							<CategorySection
								category={ suggestion.category }
								isEnabled={ isCategoryEnabled }
								onToggle={ handleCategoryToggle }
							/>
						) }
						<div className="yst-flex yst-flex-col yst-gap-6">
							<div className="yst-flex yst-flex-col yst-gap-4">
								<TextField
									id="content-outline-focus-keyphrase"
									label={ __( "Focus Keyphrase", "wordpress-seo" ) }
									value={ focusKeyphrase }
									onChange={ handleFocusKeyphraseChange }
								/>
								<TextField
									id="content-outline-title"
									label={ __( "Title", "wordpress-seo" ) }
									value={ title }
									onChange={ handleTitleChange }
								/>
								<div>
									<TextareaField
										id="content-outline-meta-description"
										label={ __( "Meta description", "wordpress-seo" ) }
										value={ metaDescription }
										onChange={ handleMetaDescriptionChange }
										className="yst-mb-2"
									/>
									<MetaDescriptionProgressBar value={ metaDescription } />
								</div>
							</div>
							<hr className="yst-border-slate-200" />
							<div className="yst-flex yst-items-end yst-justify-between" style={ { marginBottom: "-16px" } }>
								<span className="yst-font-medium yst-text-sm yst-text-slate-800">
									{ __( "Blog post structure", "wordpress-seo" ) }
								</span>
								<span className="yst-text-xs yst-text-slate-500">
									{ __( "Drag to reorder", "wordpress-seo" ) }
								</span>
							</div>
							<div role="listbox" aria-label={ __( "Blog post structure", "wordpress-seo" ) } className="yst-flex yst-flex-col yst-gap-2">
								{ structure.map( ( item, index ) => (
									<StructureRow
										key={ item.id }
										index={ index }
										heading={ item.heading }
										dragOverIndex={ dragOverIndex }
										onDragStart={ handleDragStart }
										onDragOver={ handleDragOver }
										onDrop={ handleDrop }
										onDragEnd={ handleDragEnd }
										onMoveUp={ handleMoveUp }
										onMoveDown={ handleMoveDown }
										totalItems={ structure.length }
									/>
								) ) }
							</div>
						</div>
					</Transition>
				</div>
				<div
					className="yst-sticky -yst-left-6 -yst-right-6 yst-bottom-0 yst-h-10 yst-pointer-events-none yst-bg-gradient-to-t yst-from-white yst-to-transparent yst-transition-opacity"
					aria-hidden="true"
				/>
			</Modal.Container.Content>
			<Modal.Container.Footer className="yst-flex yst-items-center yst-justify-between yst-p-6 yst-border-t yst-border-slate-200">
				<Button variant="secondary" onClick={ handleBackToSuggestions } className="yst-flex yst-items-center yst-gap-1.5">
					<ArrowLeftIcon className="yst-w-4 yst-h-4" />
					{ __( "Content suggestions", "wordpress-seo" ) }
				</Button>
				<Button variant="ai-primary" onClick={ handleApplyOutline } className="[&>.yst-button--sparkles-icon]:yst-hidden yst-ps-3" disabled={ isLoading } isLoading={ isLoading }>
					{ __( "Add outline to post", "wordpress-seo" ) }
				</Button>
			</Modal.Container.Footer>
		</>
	);
};
