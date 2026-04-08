import { Badge, Button, Modal, SkeletonLoader, TextField, TextareaField, Toggle, Tooltip, useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { useSelect } from "@wordpress/data";
import { useState, useCallback, useRef, useEffect } from "@wordpress/element";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { get } from "lodash";
import classNames from "classnames";
import { intentBadge } from "./intent-badge";

/**
 * Intent badge with a hover tooltip describing the intent type.
 *
 * @param {Object} badge The badge config from intentBadge mapping.
 * @param {string} intent The raw intent string (fallback when badge is undefined).
 *
 * @returns {JSX.Element} The IntentBadgeWithTooltip component.
 */
const IntentBadgeWithTooltip = ( { badge, intent } ) => {
	const svgAriaProps = useSvgAria();
	const [ isTooltipVisible, setIsTooltipVisible ] = useState( false );
	const handleMouseEnter = useCallback( () => setIsTooltipVisible( true ), [] );
	const handleMouseLeave = useCallback( () => setIsTooltipVisible( false ), [] );
	const tooltipId = `intent-tooltip-${ intent }`;

	if ( ! badge ) {
		return <Badge>{ intent }</Badge>;
	}

	const { Icon } = badge;
	return (
		<Badge
			className={ classNames( "yst-relative yst-flex yst-items-center yst-gap-1 yst-w-fit yst-text-xs yst-cursor-default", badge.classes ) }
			aria-describedby={ tooltipId }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<Icon className={ classNames( "yst-w-3", badge.classes ) } { ...svgAriaProps } /> { badge.label }
			{ isTooltipVisible && <Tooltip id={ tooltipId } className="yst-max-w-48 yst-z-50" position="top-right">{ badge.tooltip }</Tooltip> }
		</Badge>
	);
};

/**
 * Callout box showing the intent badge and reasoning for the suggestion.
 * Background and border colors adapt to the intent type.
 *
 * @param {string} intent The intent type (e.g. "informational").
 * @param {string} description The reason for the suggestion.
 *
 * @returns {JSX.Element} The IntentCallout component.
 */
const IntentCallout = ( { intent, description } ) => {
	const badge = intentBadge[ intent ];
	const calloutClasses = badge ? badge.calloutClasses : "yst-bg-slate-50 yst-border-slate-200";
	const textClasses = badge ? badge.calloutTextClasses : "yst-text-slate-900";

	return (
		<div
			role="note"
			className={ classNames( "yst-border yst-rounded-md yst-p-4 yst-flex yst-flex-col yst-gap-2", calloutClasses ) }
		>
			<div className="yst-flex yst-items-center yst-gap-2">
				<IntentBadgeWithTooltip badge={ badge } intent={ intent } />
				<span className={ classNames( "yst-font-medium yst-text-sm", textClasses ) }>
					{ __( "Why this content?", "wordpress-seo" ) }
				</span>
			</div>
			<p className={ classNames( "yst-text-sm", textClasses ) }>{ description }</p>
		</div>
	);
};

const META_DESCRIPTION_MAX_LENGTH = 156;
const META_DESCRIPTION_RECOMMENDED_MIN_LENGTH = 120;

/**
 * Returns the progress bar color based on the meta description length.
 * Matches the scoring logic and colors from the Yoast snippet editor ProgressBar:
 * - 1–120 chars: orange / $color_ok (#ee7c1b)
 * - 121–156 chars: green / $color_good (#7ad03a)
 * - >156 chars: orange / $color_ok (#ee7c1b)
 *
 * @param {number} length The current character count.
 * @returns {string} The hex color for the progress bar.
 */
const getProgressColor = ( length ) => {
	if ( length > META_DESCRIPTION_RECOMMENDED_MIN_LENGTH && length <= META_DESCRIPTION_MAX_LENGTH ) {
		return "#7ad03a";
	}
	return "#ee7c1b";
};

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
const StructureRow = ( { level, title, index, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd, onMoveUp, onMoveDown, totalItems } ) => {
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
		aria-label={ `${ level } ${ title }` }
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
			<span className="yst-font-medium yst-text-slate-500 yst-shrink-0">{ level }</span>
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
					screenReaderLabel={ __( "Suggest category", "wordpress-seo" ) }
				/>
			</div>
			<p className="yst-text-sm yst-text-slate-600">
				{ __( "Adds post to an existing category, when applicable.", "wordpress-seo" ) }
			</p>
		</div>
		{ isEnabled && (
			isLoading
				? <SkeletonLoader className="yst-w-20 yst-h-6 yst-rounded-full" />
				: <Badge variant="plain" className="yst-w-fit">{ category }</Badge>
		) }
	</div>
);

/**
 * @typedef {Object} StructureItem
 * @property {string} level The heading level (e.g. "H2") or type indicator (e.g. a list icon).
 * @property {string} title The section title.
 */

/**
 * @typedef {Object} OutlineSuggestion
 * @property {string}          intent          The intent type (e.g. "informational", "navigational", "commercial").
 * @property {string}          title           The suggested post title.
 * @property {string}          description     The reasoning behind the suggestion.
 * @property {string}          focusKeyphrase  The suggested focus keyphrase.
 * @property {string}          metaDescription The suggested meta description.
 * @property {StructureItem[]} structure       The suggested blog post structure.
 */

/**
 * Hook that simulates loading state with timers.
 * Set window.contentPlanner.isOutlineLoading = true to force loading state for testing.
 * Starts loading automatically on mount (the Transition unmounts this component when hidden).
 *
 * Temporary: replace with real API loading state when the outline endpoint is available.
 * Remove the forceLoading / window.contentPlanner.isOutlineLoading mechanism and the setTimeout logic.
 *
 * @returns {boolean} Whether the modal content is in a loading state.
 */
const useSimulatedLoading = () => {
	const [ status, setStatus ] = useState( "idle" );
	const forceLoading = get( window, "contentPlanner.isOutlineLoading", false );

	useEffect( () => {
		if ( ! forceLoading ) {
			const loadingTimer = setTimeout( () => {
				setStatus( "loading" );
			}, 100 );

			const timer = setTimeout( () => {
				setStatus( "success" );
			}, 3000 );
			return () => {
				clearTimeout( loadingTimer );
				clearTimeout( timer );
			};
		}
	}, [ forceLoading ] );

	return forceLoading || status === "loading" || status === "idle";
};

/**
 * Assigns stable unique IDs to structure items for use as React keys.
 *
 * @param {StructureItem[]} items The structure items.
 * @returns {Array} Items with `id` property added.
 */
const withIds = ( items ) => items.map( ( item, i ) => ( { ...item, id: `${ i }-${ item.level }-${ item.title }` } ) );

/**
 * Content Outline Modal panel component.
 * Renders inside a parent Modal (managed by FeatureModal).
 *
 * @param {Function}           onBack      The function to call to go back to content suggestions.
 * @param {Function}           onAddOutline The function to call to add the outline to the post.
 * @param {OutlineSuggestion}  suggestion  The content outline suggestion to display.
 * @param {number}             sparksLimit Optional. If provided, show the UsageCounter.
 * @param {number}             sparksUsage Optional. Current sparks usage count.
 * @param {string}             category    Optional. If provided, show the suggest category section.
 *
 * @returns {JSX.Element} The ContentOutlineModal component.
 */
export const ContentOutlineModal = ( { onBack, onAddOutline, suggestion, sparksLimit, sparksUsage, category } ) => {
	const isPremium = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsPremium(), [] );
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );
	const [ isCategoryEnabled, setIsCategoryEnabled ] = useState( true );
	const isLoading = useSimulatedLoading();
	const [ focusKeyphrase, setFocusKeyphrase ] = useState( suggestion.focusKeyphrase );
	const [ title, setTitle ] = useState( suggestion.title );
	const [ metaDescription, setMetaDescription ] = useState( suggestion.metaDescription );
	const [ structure, setStructure ] = useState( () => withIds( suggestion.structure ) );
	const [ dragOverIndex, setDragOverIndex ] = useState( null );
	const dragIndexRef = useRef( null );

	useEffect( () => {
		setFocusKeyphrase( suggestion.focusKeyphrase );
		setTitle( suggestion.title );
		setMetaDescription( suggestion.metaDescription );
		setStructure( withIds( suggestion.structure ) );
	}, [ suggestion ] );

	// Focus the close button on mount so screen readers announce the dialog context.
	useEffect( () => {
		closeButtonRef.current?.focus();
	}, [] );

	const handleFocusKeyphraseChange = useCallback( ( e ) => setFocusKeyphrase( e.target.value ), [] );
	const handleTitleChange = useCallback( ( e ) => setTitle( e.target.value ), [] );
	const handleMetaDescriptionChange = useCallback( ( e ) => setMetaDescription( e.target.value ), [] );

	const handleCategoryToggle = useCallback( () => {
		setIsCategoryEnabled( ( prev ) => ! prev );
	}, [] );

	const handleDragStart = useCallback( ( e, index ) => {
		dragIndexRef.current = index;
		e.dataTransfer.effectAllowed = "move";
	}, [] );

	const handleDragOver = useCallback( ( e, index ) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragOverIndex( index );
	}, [] );

	const handleDrop = useCallback( ( e, dropIndex ) => {
		e.preventDefault();
		const dragIndex = dragIndexRef.current;
		if ( dragIndex === null || dragIndex === dropIndex ) {
			setDragOverIndex( null );
			return;
		}
		setStructure( ( prev ) => {
			const updated = [ ...prev ];
			const [ moved ] = updated.splice( dragIndex, 1 );
			const destinationIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
			updated.splice( destinationIndex, 0, moved );
			return updated;
		} );
		setDragOverIndex( null );
		dragIndexRef.current = null;
	}, [] );

	const handleDragEnd = useCallback( () => {
		setDragOverIndex( null );
		dragIndexRef.current = null;
	}, [] );

	const handleMoveUp = useCallback( ( index ) => {
		setStructure( ( prev ) => {
			const updated = [ ...prev ];
			const [ moved ] = updated.splice( index, 1 );
			updated.splice( index - 1, 0, moved );
			return updated;
		} );
	}, [] );

	const handleMoveDown = useCallback( ( index ) => {
		setStructure( ( prev ) => {
			const updated = [ ...prev ];
			const [ moved ] = updated.splice( index, 1 );
			updated.splice( index + 1, 0, moved );
			return updated;
		} );
	}, [] );

	return (
		<Modal.Panel className="yst-p-0 yst-max-w-2xl" hasCloseButton={ false }>
			<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close content outline", "wordpress-seo" ) } />
			<Modal.Container>
				<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
					<YoastIcon className="yst-fill-primary-500 yst-w-4" { ...svgAriaProps } />
					<Modal.Title size="2" className="yst-flex-grow"> { __( "Content outline", "wordpress-seo" ) } </Modal.Title>
					<Badge size="small">{ __( "Beta", "wordpress-seo" ) }</Badge>
					{ sparksLimit && (
						<UsageCounter
							limit={ sparksLimit }
							requests={ sparksUsage }
							mentionBetaInTooltip={ isPremium }
							mentionResetInTooltip={ isPremium }
						/>
					) }
				</Modal.Container.Header>
				<div className="yst-px-6 yst-pt-6">
					<IntentCallout
						intent={ suggestion.intent }
						description={ suggestion.description }
					/>
				</div>
				<Modal.Container.Content className="yst-overflow-y-auto yst-pt-6 yst-px-6 yst-pb-0 yst-m-0 yst-relative" aria-busy={ isLoading }>
					<div className="yst-flex yst-flex-col yst-gap-6 yst-pb-4">
						<Modal.Description className="yst-text-sm yst-text-slate-600">
							{ __( "Review and customize your content outline before adding it to your post", "wordpress-seo" ) }
						</Modal.Description>

						<hr className="yst-border-slate-200" />

						{ category && (
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
											level={ item.level }
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
					<Button variant="secondary" onClick={ onBack } className="yst-flex yst-items-center yst-gap-1.5">
						<ArrowLeftIcon className="yst-w-4 yst-h-4" />
						{ __( "Content suggestions", "wordpress-seo" ) }
					</Button>
					{ /* Temporary: wire onAddOutline to pass the edited outline state to the parent for post insertion. */ }
					<Button variant="ai-primary" onClick={ onAddOutline }>
						{ __( "Add outline to post", "wordpress-seo" ) }
					</Button>
				</Modal.Container.Footer>
			</Modal.Container>
		</Modal.Panel>
	);
};
