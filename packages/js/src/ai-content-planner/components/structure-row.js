import { SkeletonLoader, useSvgAria } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import classNames from "classnames";

/**
 * Base row layout shared by StructureRow and StructureRowSkeleton.
 *
 * @param {Object}    props              The component props.
 * @param {ReactNode} props.children     The content to display inside the row.
 * @param {string}    props.className    Additional class names for styling the button.
 * @param {Object}    [props.dragProps]  Props spread onto the outer <li> (draggable, drag event handlers).
 *                                       Keeping drag on <li> avoids browser quirks with dragging <button>.
 * @param {Object}    [props.buttonProps] Props spread onto the inner <button> (accessibility, keyboard handlers).
 *
 * @returns {JSX.Element} The Row component.
 */
const Row = ( { children, className, dragProps, buttonProps } ) => {
	const svgAriaProps = useSvgAria();

	return ( <li { ...dragProps }>
		{ /* <button> spans the full row so focus and keyboard handlers live on an interactive element,
		     satisfying jsx-a11y rules. Drag events stay on the <li> to avoid browser quirks. */ }
		<button
			type="button"
			className={ classNames(
				"yst-h-10 yst-w-full yst-border yst-rounded-md yst-shadow yst-flex yst-items-center yst-gap-3 yst-px-3 yst-select-none",
				className
			) }
			{ ...buttonProps }
		>
			{ /* Drag handle icon (6-dot grip). */ }
			<svg
				className="yst-w-2.5 yst-h-4 yst-shrink-0"
				viewBox="0 0 10 16"
				fill="currentColor"
				{ ...svgAriaProps }
			>
				<circle cx="2" cy="2" r="1.5" />
				<circle cx="8" cy="2" r="1.5" />
				<circle cx="2" cy="8" r="1.5" />
				<circle cx="8" cy="8" r="1.5" />
				<circle cx="2" cy="14" r="1.5" />
				<circle cx="8" cy="14" r="1.5" />
			</svg>
			<div className="yst-flex yst-items-center yst-gap-3 yst-flex-1 yst-min-w-0">
				{ children }
			</div>
		</button>
	</li> );
};

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
 * @param {Function} onAnnounce    Callback to announce a reorder action to screen readers.
 *
 * @returns {JSX.Element} The StructureRow component.
 */
export const StructureRow = ( {
	heading,
	index,
	dragOverIndex,
	onDragStart,
	onDragOver,
	onDrop,
	onDragEnd,
	onMoveUp,
	onMoveDown,
	totalItems,
	onAnnounce,
} ) => {
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
			// New position is index (1-based).
			onAnnounce( heading, index );
		}
		if ( e.key === "ArrowDown" && index < totalItems - 1 ) {
			e.preventDefault();
			onMoveDown( index );
			// New position is index + 2 (1-based).
			onAnnounce( heading, index + 2 );
		}
	}, [ index, totalItems, onMoveUp, onMoveDown, onAnnounce, heading ] );

	const dragProps = {
		draggable: "true",
		onDragStart: handleDragStart,
		onDragOver: handleDragOver,
		onDrop: handleDrop,
		onDragEnd: onDragEnd,
	};

	return ( <Row
		className={ classNames(
			"yst-bg-slate-50 yst-text-slate-400 yst-border-slate-300 yst-text-sm yst-cursor-grab yst-transition-all focus:yst-outline focus:yst-outline-2 focus:yst-outline-offset-2 focus:yst-outline-primary-500",
			dragOverIndex === index && "yst-border-primary-500 yst-border-2"
		) }
		buttonProps={ { onKeyDown: handleKeyDown } }
		dragProps={ dragProps }
	>
		<span className="yst-font-medium yst-text-slate-500">H2</span>
		<span className="yst-text-slate-600">{ heading }</span>
		<span className="yst-sr-only">{ sprintf(
			/* translators: 1: current position, 2: total items. */
			__( "Position %1$d out of %2$d. Use Alt+Arrow Up/Down to reorder.", "wordpress-seo" ),
			index + 1,
			totalItems ) }</span>
	</Row> );
};

/**
 * Loading placeholder mirroring the StructureRow layout.
 *
 * @returns {JSX.Element} The StructureRowSkeleton component.
 */
export const StructureRowSkeleton = () => {
	return ( <Row
		className="yst-bg-white yst-text-slate-300 yst-border-slate-200"
		buttonProps={ { disabled: true } }
		dragProps={ { "aria-hidden": true } }
	>
		<SkeletonLoader className="yst-h-3.5 yst-w-5 yst-rounded yst-shrink-0" />
		<SkeletonLoader className="yst-h-3.5 yst-w-32 yst-rounded" />
	</Row> );
};
