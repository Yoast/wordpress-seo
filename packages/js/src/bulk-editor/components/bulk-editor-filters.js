import FilterIcon from "@heroicons/react/outline/FilterIcon";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, CheckboxGroup, Popover, useSvgAria } from "@yoast/ui-library";
import { FIELD_SET_SOCIAL, NEEDS_IMPROVEMENT_DESCRIPTION, NEEDS_IMPROVEMENT_FIELD_PARAMS, NEEDS_IMPROVEMENT_TITLE, STORE_NAME } from "../constants";

/**
 * The "needs improvement" filter group: the active tab's title and description fields, each prefixed with a
 * red score dot.
 *
 * Renders nothing on a tab that has no fields for these options to target, which is not a field set at all.
 *
 * @param {Object}   props                The props.
 * @param {string}   props.activeFieldSet The active tab, which decides both the labels and whether to render.
 * @param {string[]} props.values         The checked options.
 * @param {Function} props.onChange       Called with the checked options when one is toggled.
 *
 * @returns {JSX.Element|null} The filter group, or null on a tab that has no fields to target.
 */
const NeedsImprovementFilter = ( { activeFieldSet, values, onChange } ) => {
	const isSocial = activeFieldSet === FIELD_SET_SOCIAL;
	// The red dot in front of each option (and the group's "needs improvement" legend) carries the
	// "needs improvement" meaning, so the visible labels are the plain field names.
	const options = useMemo( () => [
		{
			value: NEEDS_IMPROVEMENT_TITLE,
			label: isSocial
				? __( "Social titles", "wordpress-seo" )
				: __( "SEO titles", "wordpress-seo" ),
		},
		{
			value: NEEDS_IMPROVEMENT_DESCRIPTION,
			label: isSocial
				? __( "Social descriptions", "wordpress-seo" )
				: __( "Meta descriptions", "wordpress-seo" ),
		},
	], [ isSocial ] );

	// A tab with no entry here has no title/description fields for these options to target, so the group
	// would be checkboxes that filter nothing. Derived from the map rather than from a tab id so this,
	// the smart-select menu and the request params agree.
	if ( ! NEEDS_IMPROVEMENT_FIELD_PARAMS[ activeFieldSet ] ) {
		return null;
	}

	return (
		<CheckboxGroup
			id="bulk-editor-needs-improvement-filter"
			// The divider, the red score dot on each option, and the visually-hidden group legend all live in the
			// `yst-bulk-editor-needs-improvement` rule in the page stylesheet.
			label={ __( "Needs improvement", "wordpress-seo" ) }
			className="yst-bulk-editor-filter-group yst-bulk-editor-needs-improvement"
			options={ options }
			values={ values }
			onChange={ onChange }
		/>
	);
};

/**
 * The Filters button and popover: narrows the table by post status, by which fields need improvement
 * and, when a selection was carried over from the WP admin overview, by that selection. A badge shows
 * how many filters are applied.
 *
 * The "needs improvement" options are tab-agnostic (values {@link NEEDS_IMPROVEMENT_TITLE} /
 * {@link NEEDS_IMPROVEMENT_DESCRIPTION}); only their labels change with the active tab, and the query store
 * clears the selection on a tab switch so the filter never silently re-targets the other tab's field. The
 * group is left out entirely on the "Image alt text" tab.
 *
 * WooCommerce SEO renders this same component in the "Image alt text" tab it fills, through
 * `window.yoast.bulkEditor.components` — prop-free and store-driven so both callers stay in sync.
 *
 * @returns {JSX.Element} The filters control.
 */
export const BulkEditorFilters = () => {
	const statuses = useSelect( ( select ) => select( STORE_NAME ).selectStatuses(), [] );
	const needsImprovement = useSelect( ( select ) => select( STORE_NAME ).selectNeedsImprovement(), [] );
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const overviewIds = useSelect( ( select ) => select( STORE_NAME ).selectOverviewIds(), [] );
	const isOverviewFilterActive = useSelect( ( select ) => select( STORE_NAME ).selectIsOverviewFilterActive(), [] );
	const { setStatuses, setNeedsImprovement, setOverviewFilterActive } = useDispatch( STORE_NAME );
	const [ isOpen, setIsOpen ] = useState( false );
	const containerRef = useRef( null );
	const triggerRef = useRef( null );
	const svgAriaProps = useSvgAria();

	const statusOptions = useMemo( () => [
		{ value: "publish", label: __( "Published", "wordpress-seo" ) },
		{ value: "future", label: __( "Scheduled", "wordpress-seo" ) },
		{ value: "pending", label: __( "Pending", "wordpress-seo" ) },
		{ value: "draft", label: __( "Draft", "wordpress-seo" ) },
	], [] );

	const overviewOptions = useMemo( () => [
		{ value: "overview", label: __( "Overview selection", "wordpress-seo" ) },
	], [] );

	const onChangeOverviewFilter = useCallback(
		( values ) => setOverviewFilterActive( values.includes( "overview" ) ),
		[ setOverviewFilterActive ]
	);

	const toggleOpen = useCallback( () => setIsOpen( ( open ) => ! open ), [] );

	useEffect( () => {
		if ( ! isOpen ) {
			return () => {};
		}
		// Return focus to the trigger so dismissing the dialog never drops focus to the document body.
		const close = () => {
			setIsOpen( false );
			triggerRef.current?.focus();
		};
		const onPointerDown = ( event ) => {
			if ( containerRef.current && ! containerRef.current.contains( event.target ) ) {
				close();
			}
		};
		const onKeyDown = ( event ) => {
			if ( event.key === "Escape" ) {
				close();
			}
		};
		document.addEventListener( "mousedown", onPointerDown );
		document.addEventListener( "keydown", onKeyDown );
		return () => {
			document.removeEventListener( "mousedown", onPointerDown );
			document.removeEventListener( "keydown", onKeyDown );
		};
	}, [ isOpen ] );

	const appliedCount = statuses.length + needsImprovement.length + ( isOverviewFilterActive ? 1 : 0 );

	return (
		<div ref={ containerRef } className="yst-relative">
			<Button ref={ triggerRef } variant="secondary" size="small" onClick={ toggleOpen } aria-expanded={ isOpen } aria-haspopup="dialog">
				{ __( "Filters", "wordpress-seo" ) }
				{ appliedCount > 0 && <Badge variant="plain" size="small" className="yst-mx-2 !yst-rounded">{ appliedCount }</Badge> }
				<FilterIcon className={ `yst-h-4 yst-w-4 yst-text-slate-500 ${ appliedCount > 0 ? "" : "yst-ms-2" }` } { ...svgAriaProps } />
			</Button>
			<Popover
				isVisible={ isOpen }
				setIsVisible={ setIsOpen }
				position="bottom-left"
				className="before:yst-hidden !yst-top-full yst-mt-1 yst-py-0.5 yst-px-0 yst-shadow-lg"
				aria-label={ __( "Filters", "wordpress-seo" ) }
			>
				{ overviewIds.length > 0 && (
					<CheckboxGroup
						id="bulk-editor-overview-filter"
						className="yst-bulk-editor-filter-group yst-bulk-editor-overview-selection"
						options={ overviewOptions }
						values={ isOverviewFilterActive ? [ "overview" ] : [] }
						onChange={ onChangeOverviewFilter }
					/>
				) }
				<CheckboxGroup
					id="bulk-editor-status-filter"
					className="yst-bulk-editor-filter-group"
					options={ statusOptions }
					values={ statuses }
					onChange={ setStatuses }
				/>
				<NeedsImprovementFilter
					activeFieldSet={ activeFieldSet }
					values={ needsImprovement }
					onChange={ setNeedsImprovement }
				/>
			</Popover>
		</div>
	);
};
