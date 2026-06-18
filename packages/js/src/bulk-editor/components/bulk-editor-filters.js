import FilterIcon from "@heroicons/react/outline/FilterIcon";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, CheckboxGroup, Popover, useSvgAria } from "@yoast/ui-library";
import { STORE_NAME } from "../constants";

/**
 * The Filters button and popover: narrows the table by post status.
 * A badge shows how many filters are applied.
 *
 * @returns {JSX.Element} The filters control.
 */
export const BulkEditorFilters = () => {
	const statuses = useSelect( ( select ) => select( STORE_NAME ).selectStatuses(), [] );
	const { setStatuses } = useDispatch( STORE_NAME );
	const [ isOpen, setIsOpen ] = useState( false );
	const containerRef = useRef( null );
	const svgAriaProps = useSvgAria();

	const statusOptions = useMemo( () => [
		{ value: "publish", label: __( "Published", "wordpress-seo" ) },
		{ value: "future", label: __( "Scheduled", "wordpress-seo" ) },
		{ value: "pending", label: __( "Pending", "wordpress-seo" ) },
		{ value: "draft", label: __( "Draft", "wordpress-seo" ) },
	], [] );

	const toggleOpen = useCallback( () => setIsOpen( ( open ) => ! open ), [] );

	useEffect( () => {
		if ( ! isOpen ) {
			return () => {};
		}
		const onPointerDown = ( event ) => {
			if ( containerRef.current && ! containerRef.current.contains( event.target ) ) {
				setIsOpen( false );
			}
		};
		const onKeyDown = ( event ) => {
			if ( event.key === "Escape" ) {
				setIsOpen( false );
			}
		};
		document.addEventListener( "mousedown", onPointerDown );
		document.addEventListener( "keydown", onKeyDown );
		return () => {
			document.removeEventListener( "mousedown", onPointerDown );
			document.removeEventListener( "keydown", onKeyDown );
		};
	}, [ isOpen ] );

	const appliedCount = statuses.length;

	return (
		<div ref={ containerRef } className="yst-relative">
			<Button variant="secondary" size="small" onClick={ toggleOpen } aria-expanded={ isOpen } aria-haspopup="dialog">
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
				<CheckboxGroup
					id="bulk-editor-status-filter"
					options={ statusOptions }
					values={ statuses }
					onChange={ setStatuses }
				/>
			</Popover>
		</div>
	);
};
