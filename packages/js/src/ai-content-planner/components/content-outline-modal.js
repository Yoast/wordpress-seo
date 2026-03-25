import { Badge, Button, Modal, Title, SkeletonLoader, Toggle } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { useSelect } from "@wordpress/data";
import { useState, useCallback, useRef, useEffect } from "@wordpress/element";
import { BookOpenIcon, StarIcon, MapIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import classNames from "classnames";

const intentBadge = {
	informational: {
		classes: "yst-bg-blue-200 yst-text-blue-900",
		Icon: BookOpenIcon,
		label: __( "Informational", "wordpress-seo" ),
	},
	navigational: {
		classes: "yst-bg-violet-200 yst-text-violet-900",
		Icon: MapIcon,
		label: __( "Navigational", "wordpress-seo" ),
	},
	commercial: {
		classes: "yst-bg-yellow-200 yst-text-yellow-900",
		Icon: StarIcon,
		label: __( "Commercial", "wordpress-seo" ),
	},
};

/**
 * Blue callout box showing the intent badge and reasoning for the suggestion.
 *
 * @param {string} intent The intent type (e.g. "informational").
 * @param {string} description The reason for the suggestion.
 *
 * @returns {JSX.Element} The IntentCallout component.
 */
const IntentCallout = ( { intent, description } ) => {
	const badge = intentBadge[ intent ];
	const Icon = badge ? badge.Icon : BookOpenIcon;

	return (
		<div className="yst-bg-blue-50 yst-border yst-border-blue-200 yst-rounded-md yst-p-4 yst-flex yst-flex-col yst-gap-2">
			<div className="yst-flex yst-items-center yst-gap-2">
				{ badge ? (
					<Badge className={ classNames( "yst-flex yst-items-center yst-gap-1 yst-w-fit yst-text-xs", badge.classes ) }>
						<Icon className={ classNames( "yst-w-3", badge.classes ) } /> { badge.label }
					</Badge>
				) : (
					<Badge>{ intent }</Badge>
				) }
				<span className="yst-font-medium yst-text-sm yst-text-blue-900">
					{ __( "Why this content?", "wordpress-seo" ) }
				</span>
			</div>
			<p className="yst-text-sm yst-text-blue-900">{ description }</p>
		</div>
	);
};

/**
 * Read-only form field displaying a label and value.
 *
 * @param {string}  label     The field label.
 * @param {string}  value     The field value.
 * @param {boolean} multiline Whether to render as a taller textarea-like area.
 *
 * @returns {JSX.Element} The FormField component.
 */
const FormField = ( { label, value, multiline = false } ) => (
	<div className="yst-flex yst-flex-col yst-gap-2">
		<span className="yst-font-medium yst-text-sm yst-text-slate-800">{ label }</span>
		<div
			className={ classNames(
				"yst-bg-white yst-border yst-border-slate-300 yst-rounded-md yst-shadow-sm yst-px-3 yst-py-2 yst-text-sm yst-text-slate-600",
				multiline && "yst-min-h-20"
			) }
		>
			{ value }
		</div>
	</div>
);

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
const StructureRow = ( { level, title, index, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd } ) => {
	const handleDragStart = useCallback( ( e ) => onDragStart( e, index ), [ onDragStart, index ] );
	const handleDragOver = useCallback( ( e ) => onDragOver( e, index ), [ onDragOver, index ] );
	const handleDrop = useCallback( ( e ) => onDrop( e, index ), [ onDrop, index ] );

	return ( <div
		className={ classNames(
			"yst-bg-slate-50 yst-border yst-border-slate-300 yst-rounded-md yst-shadow yst-flex yst-items-center yst-gap-3 yst-px-3 yst-py-2 yst-cursor-grab yst-select-none yst-transition-all",
			dragOverIndex === index && "yst-border-primary-500 yst-border-2"
		) }
		draggable="true"
		onDragStart={ handleDragStart }
		onDragOver={ handleDragOver }
		onDrop={ handleDrop }
		onDragEnd={ onDragEnd }
	>
		{ /* Drag handle icon (6-dot grip) */ }
		<svg className="yst-w-2.5 yst-h-4 yst-text-slate-400 yst-shrink-0" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
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
 * Content Outline Modal component.
 *
 * @param {boolean}            isOpen      Whether the modal is open or not.
 * @param {Function}           onClose     The function to call when the modal should be closed.
 * @param {boolean}            isLoading   Whether the content outline is being generated.
 * @param {Function}           onBack      The function to call to go back to content suggestions.
 * @param {Function}           onAddOutline The function to call to add the outline to the post.
 * @param {OutlineSuggestion}  suggestion  The content outline suggestion to display.
 * @param {number}             sparksLimit Optional. If provided, show the UsageCounter.
 * @param {number}             sparksUsage Optional. Current sparks usage count.
 * @param {string}             category    Optional. If provided, show the suggest category section.
 *
 * @returns {JSX.Element} The ContentOutlineModal component.
 */
export const ContentOutlineModal = ( { isOpen, onClose, isLoading, onBack, onAddOutline, suggestion, sparksLimit, sparksUsage, category } ) => {
	const isPremium = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsPremium(), [] );
	const [ isCategoryEnabled, setIsCategoryEnabled ] = useState( true );
	const [ structure, setStructure ] = useState( suggestion.structure );
	const [ dragOverIndex, setDragOverIndex ] = useState( null );
	const dragIndexRef = useRef( null );

	useEffect( () => {
		setStructure( suggestion.structure );
	}, [ suggestion.structure ] );

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
			updated.splice( dropIndex, 0, moved );
			return updated;
		} );
		setDragOverIndex( null );
		dragIndexRef.current = null;
	}, [] );

	const handleDragEnd = useCallback( () => {
		setDragOverIndex( null );
		dragIndexRef.current = null;
	}, [] );

	return (
		<Modal
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel className="yst-p-0 yst-max-w-2xl">
				<Modal.Container>
					<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
						<YoastIcon className="yst-fill-primary-500 yst-w-4" />
						<Title size="2" className="yst-flex-grow"> { __( "Content outline", "wordpress-seo" ) } </Title>
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
					<Modal.Container.Content className="yst-overflow-y-auto yst-pt-6 yst-px-6 yst-pb-0 yst-m-0 yst-relative">
						<div className="yst-flex yst-flex-col yst-gap-6 yst-pb-6">
							<IntentCallout
								intent={ suggestion.intent }
								description={ suggestion.description }
							/>

							<p className="yst-text-sm yst-text-slate-600">
								{ __( "Review and customize your content outline before adding it to your post", "wordpress-seo" ) }
							</p>

							<hr className="yst-border-slate-200" />

							{ category && (
								<div className="yst-flex yst-flex-col yst-gap-3 yst-max-w-sm">
									<div className="yst-flex yst-flex-col yst-gap-1.5">
										<div className="yst-flex yst-items-center yst-justify-between">
											<span className="yst-font-medium yst-text-sm yst-text-slate-800">
												{ __( "Suggest category", "wordpress-seo" ) }
											</span>
											<Toggle
												id="suggest-category-toggle"
												checked={ isCategoryEnabled }
												onChange={ handleCategoryToggle }
												screenReaderLabel={ __( "Suggest category", "wordpress-seo" ) }
											/>
										</div>
										<p className="yst-text-sm yst-text-slate-600">
											{ __( "Adds post to an existing category, when applicable.", "wordpress-seo" ) }
										</p>
									</div>
									{ isCategoryEnabled && (
										isLoading
											? <SkeletonLoader className="yst-w-20 yst-h-6 yst-rounded-full" />
											: <Badge variant="plain" className="yst-w-fit">{ category }</Badge>
									) }
								</div>
							) }

							{ isLoading ? (
								<div className="yst-flex yst-flex-col yst-gap-4">
									<SkeletonFormField label={ __( "Focus Keyphrase", "wordpress-seo" ) } />
									<SkeletonFormField label={ __( "Title", "wordpress-seo" ) } />
									<SkeletonFormField label={ __( "Meta description", "wordpress-seo" ) } multiline={ true } />
								</div>
							) : (
								<>
									<div className="yst-flex yst-flex-col yst-gap-4">
										<FormField
											label={ __( "Focus Keyphrase", "wordpress-seo" ) }
											value={ suggestion.focusKeyphrase }
										/>
										<FormField
											label={ __( "Title", "wordpress-seo" ) }
											value={ suggestion.title }
										/>
										<FormField
											label={ __( "Meta description", "wordpress-seo" ) }
											value={ suggestion.metaDescription }
											multiline={ true }
										/>
									</div>

									<hr className="yst-border-slate-200" />

									<div className="yst-flex yst-flex-col yst-gap-2">
										<div className="yst-flex yst-items-end yst-justify-between">
											<span className="yst-font-medium yst-text-sm yst-text-slate-800">
												{ __( "Blog post structure", "wordpress-seo" ) }
											</span>
											<span className="yst-text-xs yst-text-slate-500">
												{ __( "Drag to reorder", "wordpress-seo" ) }
											</span>
										</div>
										{ structure.map( ( item, index ) => (
											<StructureRow
												key={ `${ item.level }-${ item.title }` }
												index={ index }
												level={ item.level }
												title={ item.title }
												dragOverIndex={ dragOverIndex }
												onDragStart={ handleDragStart }
												onDragOver={ handleDragOver }
												onDrop={ handleDrop }
												onDragEnd={ handleDragEnd }
											/>
										) ) }
									</div>
								</>
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
						<Button variant="ai-primary" onClick={ onAddOutline }>
							{ __( "Add outline to post", "wordpress-seo" ) }
						</Button>
					</Modal.Container.Footer>
				</Modal.Container>
			</Modal.Panel>
		</Modal>
	);
};
