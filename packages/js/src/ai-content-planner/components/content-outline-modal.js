import { Badge, Button, Link, Modal, SkeletonLoader, TextField, TextareaField, Toggle, useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useState, useCallback, useRef, useEffect } from "@wordpress/element";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { getDescriptionProgress, getProgressColor } from "@yoast/search-metadata-previews";
import { ContentPlannerError } from "./content-planner-error";
import classNames from "classnames";
import { IntentCallout } from "./intent-callout";
import { META_DESCRIPTION_MAX_LENGTH } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { useDraggableStructure } from "../hooks";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Progress bar indicating the meta description character length.
 *
 * @param {string} value	The meta description text.
 * @param {string} date		The meta description date.
 * @param {string} locale	The content locale, used for meta description length calculation.
 * @param {boolean}	isCornerstone   Whether the cornerstone content toggle is on or off.
 *
 * @returns {JSX.Element} The MetaDescriptionProgressBar component.
 */
const MetaDescriptionProgressBar = ( { value, date, locale, isCornerstone } ) => {
	const { actual, score } = getDescriptionProgress( value, date, isCornerstone, false, locale );
	const percentage = Math.min( ( actual / META_DESCRIPTION_MAX_LENGTH ) * 100, 100 );

	return (
		<div className="yst-w-full yst-h-2 yst-bg-slate-200 yst-rounded-full yst-overflow-hidden" aria-hidden="true">
			<div
				className="yst-h-full yst-rounded-full yst-transition-all yst-duration-300"
				style={ { width: `${ percentage }%`, backgroundColor: getProgressColor( score ) } }
			/>
		</div>
	);
};

/**
 * A single draggable row in the blog post structure list.
 *
 * @param {string}   level       The heading level (e.g. "H2") or type indicator.
 * @param {string}   title       The section title.
 * @param {number}   index       The index of the row in the list.
 * @param {number}   dragOverIndex The index of the row currently being dragged over.
 * @param {Function} onDragStart  Callback when drag starts.
 * @param {Function} onDragOver   Callback when dragging over this row.
 * @param {Function} onDrop       Callback when dropped.
 * @param {Function} onDragEnd    Callback when drag ends.
 *
 * @returns {JSX.Element} The StructureRow component.
 */
const StructureRow = ( { title, index, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd, onMoveUp, onMoveDown, totalItems } ) => {
	const svgAriaProps = useSvgAria();
	const handleDragStart = useCallback( ( e ) => onDragStart( e, index ), [ onDragStart, index ] );
	const handleDragOver = useCallback( ( e ) => onDragOver( e, index ), [ onDragOver, index ] );
	const handleDrop = useCallback( ( e ) => onDrop( e, index ), [ onDrop, index ] );
	const handleKeyDown = useCallback( ( e ) => {
		if ( ! e.altKey ) {
			return;
		}
		if ( e.key === "ArrowUp" && index > 0 ) {
			e.preventDefault();
			onMoveUp( index );
		}
		if ( e.key === "ArrowDown" && index < totalItems - 1 ) {
			e.preventDefault();
			onMoveDown( index );
		}
	}, [ index, totalItems, onMoveUp, onMoveDown ] );

	return ( <div
		role="option"
		aria-selected="false"
		aria-label={ `H2 ${ title }` }
		aria-roledescription={ __( "Draggable section", "wordpress-seo" ) }
		tabIndex="0"
		className={ classNames(
			"yst-bg-slate-50 yst-border yst-border-slate-300 yst-rounded-md yst-shadow yst-flex yst-items-center yst-gap-3 yst-px-3 yst-py-2 yst-cursor-grab yst-select-none yst-transition-all",
			dragOverIndex === index && "yst-border-primary-500 yst-border-2"
		) }
		draggable="true"
		onDragStart={ handleDragStart }
		onDragOver={ handleDragOver }
		onDrop={ handleDrop }
		onDragEnd={ onDragEnd }
		onKeyDown={ handleKeyDown }
	>
		{ /* Drag handle icon (6-dot grip) */ }
		<svg className="yst-w-2.5 yst-h-4 yst-text-slate-400 yst-shrink-0" viewBox="0 0 10 16" fill="currentColor" { ...svgAriaProps }>
			<circle cx="2" cy="2" r="1.5" />
			<circle cx="8" cy="2" r="1.5" />
			<circle cx="2" cy="8" r="1.5" />
			<circle cx="8" cy="8" r="1.5" />
			<circle cx="2" cy="14" r="1.5" />
			<circle cx="8" cy="14" r="1.5" />
		</svg>
		<div className="yst-flex yst-items-center yst-gap-3 yst-flex-1 yst-min-w-0 yst-text-sm">
			<span className="yst-font-medium yst-text-slate-500 yst-shrink-0">H2</span>
			<span className="yst-text-slate-600">{ title }</span>
		</div>
	</div> );
};

/**
 * Skeleton form field with a real label and a skeleton value.
 *
 * @param {string}  label     The field label.
 * @param {boolean} multiline Whether to render a taller skeleton area.
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
 * Category toggle section with optional loading skeleton.
 *
 * @param {string}   category    The category name.
 * @param {boolean}  isEnabled   Whether the category toggle is on.
 * @param {Function} onToggle    Callback when the toggle changes.
 * @param {boolean}  isLoading   Whether content is still loading.
 *
 * @returns {JSX.Element} The CategorySection component.
 */
const CategorySection = ( { category, isEnabled, onToggle, isLoading } ) => (
	<div className="yst-flex yst-flex-col yst-gap-3 yst-max-w-sm">
		<div className="yst-flex yst-flex-col yst-gap-1.5">
			<div className="yst-flex yst-items-center yst-justify-between">
				<span className="yst-font-medium yst-text-sm yst-text-slate-800">
					{ __( "Suggest category", "wordpress-seo" ) }
				</span>
				<Toggle
					id="suggest-category-toggle"
					checked={ isEnabled }
					onChange={ onToggle }
					disabled={ isLoading }
					screenReaderLabel={ __( "Suggest category", "wordpress-seo" ) }
				/>
			</div>
			<p className="yst-text-sm yst-text-slate-600">
				{ __( "Adds post to an existing category, when applicable.", "wordpress-seo" ) }
			</p>
		</div>
		{ isEnabled && ! isLoading && <Badge variant="plain" className="yst-w-fit">{ category.name }</Badge> }
		{ isLoading && <div className="yst-inline-flex yst-items-center yst-w-fit yst-px-2 yst-py-1 yst-rounded-full yst-border yst-border-slate-300">
			<SkeletonLoader className="yst-w-10 yst-h-3 yst-rounded" />
		</div> }
	</div>
);

/**
 * @typedef {Object} StructureItem
 * @property {string} level The heading level (e.g. "H2") or type indicator (e.g. a list icon).
 * @property {string} title The section title.
 */

/**
 * Content Outline Modal panel component.
 * Renders inside a parent Modal (managed by FeatureModal).
 *
 * @param {string}             status      The loading status of the content outline suggestion.
 * @param {boolean}            isPremium   Whether the user has a premium subscription (used for usage counter tooltip messaging).
 * @param {Function}           onBackToSuggestions The function to call to go back to content suggestions.
 * @param {Function}           onApplyOutline The function to call to add the outline to the post.
 * @param {OutlineSuggestion}  suggestion  The content outline suggestion to display.
 * @param {number}             sparksLimit Optional. If provided, show the UsageCounter.
 * @param {number}             sparksUsage Optional. Current sparks usage count.
 * @param {boolean}            isActive    Whether this panel is currently visible (used for focus management).
 * @param {Object|null}        error       The error object if the content outline failed to load, or null if there is no error.
 * @param {Function}           onRetry     The function to call to retry fetching the content outline.
 * @param {string}             modalHelpLink  The URL for the AI help link in the modal header.
 * @param {boolean}			isCornerstoneActive Whether the cornerstone content feature is active (used for meta description progress calculation).
 * @param {string}			date The date from settings (used for meta description progress calculation).
 * @param {string}			locale	The content locale, used for meta description length calculation.
 * @returns {JSX.Element} The ContentOutlineModal component.
 */
export const ContentOutlineModal = ( {
	status,
	isPremium,
	onBackToSuggestions,
	onApplyOutline,
	suggestion,
	sparksLimit,
	sparksUsage,
	isActive,
	error,
	onRetry,
	modalHelpLink,
	isCornerstoneActive,
	date,
	locale,
} ) => {
	// eslint-disable-next-line camelcase
	const { category, keyphrase, meta_description } = suggestion;
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );
	const [ isCategoryEnabled, setIsCategoryEnabled ] = useState( true );
	const isLoading = status === ASYNC_ACTION_STATUS.loading;
	const [ focusKeyphrase, setFocusKeyphrase ] = useState( keyphrase );
	const [ title, setTitle ] = useState( suggestion.title );
	const [ metaDescription, setMetaDescription ] = useState( meta_description );

	const { structure,
		dragOverIndex,
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleDragEnd,
		handleMoveUp,
		handleMoveDown } = useDraggableStructure();

	useEffect( () => {
		setFocusKeyphrase( suggestion.keyphrase );
		setTitle( suggestion.title );
		setMetaDescription( suggestion.meta_description );
	}, [ suggestion ] );

	// Focus the close button when the panel becomes active so screen readers announce the dialog context.
	useEffect( () => {
		if ( isActive ) {
			closeButtonRef.current?.focus();
		}
	}, [ isActive ] );

	const handleFocusKeyphraseChange = useCallback( ( e ) => setFocusKeyphrase( e.target.value ), [] );
	const handleTitleChange = useCallback( ( e ) => setTitle( e.target.value ), [] );
	const handleMetaDescriptionChange = useCallback( ( e ) => setMetaDescription( e.target.value ), [] );

	const handleCategoryToggle = useCallback( () => {
		setIsCategoryEnabled( ( prev ) => ! prev );
	}, [] );

	const handleApplyOutline = useCallback( () => {
		onApplyOutline( {
			title,
			metaDescription,
			focusKeyphrase,
			category: isCategoryEnabled ? category : null,
			structure,
		} );
	}, [ onApplyOutline, title, metaDescription, focusKeyphrase, isCategoryEnabled, category, structure ] );

	const renderBody = () => {
		if ( status === ASYNC_ACTION_STATUS.error ) {
			return (
				<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
					<ContentPlannerError
						errorCode={ error.errorCode }
						errorIdentifier={ error.errorIdentifier }
						errorMessage={ error.errorMessage }
						onRetry={ onRetry }
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
						{ ( category || isLoading ) && (
							<CategorySection
								category={ category }
								isEnabled={ isCategoryEnabled }
								onToggle={ handleCategoryToggle }
								isLoading={ isLoading }
							/>
						) }
						{ isLoading && (
							<div className="yst-flex yst-flex-col yst-gap-4">
								<SkeletonFormField label={ __( "Focus Keyphrase", "wordpress-seo" ) } />
								<SkeletonFormField label={ __( "Title", "wordpress-seo" ) } />
								<SkeletonFormField label={ __( "Meta description", "wordpress-seo" ) } multiline={ true } />
							</div>
						) }
						{ ! isLoading && (
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
										<MetaDescriptionProgressBar
											value={ metaDescription }
											date={ date }
											locale={ locale }
											isCornerstone={ isCornerstoneActive }
										/>
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
											title={ item.title }
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
						) }
					</div>
					<div
						className="yst-sticky -yst-left-6 -yst-right-6 yst-bottom-0 yst-h-10 yst-pointer-events-none yst-bg-gradient-to-t yst-from-white yst-to-transparent yst-transition-opacity"
						aria-hidden="true"
					/>
				</Modal.Container.Content>
				<Modal.Container.Footer className="yst-flex yst-items-center yst-justify-between yst-p-6 yst-border-t yst-border-slate-200">
					<Button variant="secondary" onClick={ onBackToSuggestions } className="yst-flex yst-items-center yst-gap-1.5">
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

	return (
		<Modal.Panel className="yst-p-0 yst-max-w-2xl" hasCloseButton={ false }>
			<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close content outline", "wordpress-seo" ) } />
			<Modal.Container>
				<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
					<YoastIcon className="yst-fill-primary-500 yst-w-4" { ...svgAriaProps } />
					<Modal.Title size="2"> { __( "Content outline", "wordpress-seo" ) } </Modal.Title>
					<Link
						href={ modalHelpLink }
						variant="primary"
						className="yst-no-underline"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={ __( "Learn more about AI (Opens in a new browser tab)", "wordpress-seo" ) }
					>
						<QuestionMarkCircleIcon { ...svgAriaProps } className="yst-w-4 yst-h-4 yst-text-slate-500 yst-shrink-0" />
					</Link>
					<Badge size="small">{ __( "Beta", "wordpress-seo" ) }</Badge>
					<span className="yst-flex-grow" />
					{ ! error && sparksLimit && (
						<UsageCounter
							limit={ sparksLimit }
							requests={ sparksUsage }
							mentionBetaInTooltip={ isPremium }
							mentionResetInTooltip={ isPremium }
						/>
					) }
				</Modal.Container.Header>
				{ renderBody() }
			</Modal.Container>
		</Modal.Panel>
	);
};
