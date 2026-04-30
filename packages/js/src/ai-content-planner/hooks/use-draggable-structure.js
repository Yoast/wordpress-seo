import { useState, useCallback, useRef, useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { CONTENT_PLANNER_STORE } from "../constants";

/**
 * Manages the draggable structure list state and all related drag-and-drop
 * and keyboard-move handlers. Reads the outline from the store and resets
 * the structure whenever it changes.
 *
 * @returns {Object} The structure state, the dragOverIndex, and all handlers.
 */
export const useDraggableStructure = () => {
	const outline = useSelect( ( select ) => select( CONTENT_PLANNER_STORE ).selectContentOutline(), [] );
	const [ structure, setStructure ] = useState( outline );
	const [ dragOverIndex, setDragOverIndex ] = useState( null );
	const [ reorderMessage, setReorderMessage ] = useState( "" );
	const dragIndexRef = useRef( null );

	const handleAnnounce = useCallback( ( heading, newPosition ) => {
		setReorderMessage( sprintf(
			/* translators: 1: heading text, 2: new 1-based position, 3: total items. */
			__( "%1$s moved to position %2$d of %3$d.", "wordpress-seo" ),
			heading,
			newPosition,
			structure.length
		) );
	}, [ structure.length ] );

	useEffect( () => {
		setStructure( outline );
	}, [ outline ] );

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

	return {
		structure,
		dragOverIndex,
		reorderMessage,
		handleAnnounce,
		handleDragStart,
		handleDragOver,
		handleDrop,
		handleDragEnd,
		handleMoveUp,
		handleMoveDown,
	};
};
