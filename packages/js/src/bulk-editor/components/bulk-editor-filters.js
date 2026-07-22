import FilterIcon from "@heroicons/react/outline/FilterIcon";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, CheckboxGroup, Popover, useSvgAria } from "@yoast/ui-library";
import { STORE_NAME } from "../constants";

/**
 * The Filters button and popover: narrows the table by post status and, when a selection was carried
 * over from the WP admin overview, by that selection. A badge shows how many filters are applied.
 *
 * @returns {JSX.Element} The filters control.
 */
export const BulkEditorFilters = () => {
	const statuses = useSelect( ( select ) => select( STORE_NAME ).selectStatuses(), [] );
	const overviewIds = useSelect( ( select ) => select( STORE_NAME ).selectOverviewIds(), [] );
	const isOverviewFilterActive = useSelect( ( select ) => select( STORE_NAME ).selectIsOverviewFilterActive(), [] );
	const { setStatuses, setOverviewFilterActive } = useDispatch( STORE_NAME );
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

	const appliedCount = statuses.length + ( isOverviewFilterActive ? 1 : 0 );

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
				className="before:yst-hidden !yst-top-full yst-mt-1 yst-p-3 yst-shadow-lg"
				aria-label={ __( "Filters", "wordpress-seo" ) }
			>
				{ overviewIds.length > 0 && (
					<CheckboxGroup
						id="bulk-editor-overview-filter"
						className="[&_.yst-checkbox]:yst-cursor-pointer [&_label]:!yst-cursor-pointer [&_.yst-checkbox]:yst-rounded [&_.yst-checkbox]:-yst-mx-2 [&_.yst-checkbox]:yst-px-2 [&_.yst-checkbox]:yst-py-1 [&_.yst-checkbox:hover]:yst-bg-slate-50"
						options={ overviewOptions }
						values={ isOverviewFilterActive ? [ "overview" ] : [] }
						onChange={ onChangeOverviewFilter }
					/>
				) }
				<CheckboxGroup
					id="bulk-editor-status-filter"
					className="[&_.yst-checkbox]:yst-cursor-pointer [&_label]:!yst-cursor-pointer [&_.yst-checkbox]:yst-rounded [&_.yst-checkbox]:-yst-mx-2 [&_.yst-checkbox]:yst-px-2 [&_.yst-checkbox]:yst-py-1 [&_.yst-checkbox:hover]:yst-bg-slate-50"
					options={ statusOptions }
					values={ statuses }
					onChange={ setStatuses }
				/>
			</Popover>
		</div>
	);
};
