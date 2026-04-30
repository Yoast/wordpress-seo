import { useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import classNames from "classnames";

/**
 * A single draggable row in the blog post structure list.
 *
 * @param {string}   heading       The section heading.
 * @param {number}   index         The index of the row in the list.
 * @param {number}   dragOverIndex The index of the row currently being dragged over.
 * @param {Function} onDragStart   Callback when drag starts.
 * @param {Function} onDragOver    Callback when dragging over this row.
 * @param {Function} onDrop        Callback when dropped.
 * @param {Function} onDragEnd     Callback when drag ends.
 * @param {Function} onMoveUp      Callback to move the row up.
 * @param {Function} onMoveDown    Callback to move the row down.
 * @param {number}   totalItems    Total number of rows in the list.
 *
 * @returns {JSX.Element} The StructureRow component.
 */
export const StructureRow = ( { heading, index, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd, onMoveUp, onMoveDown, totalItems } ) => {
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
		aria-label={ `H2 ${ heading }` }
		aria-roledescription={ __( "Draggable section", "wordpress-seo" ) }
		tabIndex="0"
		className={ classNames(
			"yst-bg-slate-50 yst-border yst-border-slate-300 yst-rounded-md yst-shadow yst-flex yst-items-center yst-gap-3 yst-px-3 yst-py-2 yst-cursor-grab yst-select-none yst-transition-all focus:yst-outline focus:yst-outline-2 focus:yst-outline-offset-2 focus:yst-outline-primary-500",
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
			<span className="yst-text-slate-600">{ heading }</span>
		</div>
	</div> );
};
