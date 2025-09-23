import { PlusIcon } from "@heroicons/react/outline";
import { createBlock } from "@wordpress/blocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * AddBlockButton component to render the 'add block' button.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.showUpsellBadge Whether to show the upsell badge.
 * @param {string} props.blockName The name of the block to insert.
 * @returns {JSX.Element} The AddBlockButton component.
 */
export const AddBlockButton = ( { showUpsellBadge, blockName } ) => {
	const { insertBlock, replaceBlock } = useDispatch( "core/block-editor" );
	const { blockInsertionPoint, blocks } = useSelect( select => ( {
		blockInsertionPoint: select( "core/block-editor" ).getBlockInsertionPoint(),
		blocks: select( "core/block-editor" ).getBlocks(),
	} ), [] );
	const [ isClicked, setIsClicked ] = useState( false );
	const [ showTooltip, setShowTooltip ] = useState( false );

	const handleButtonClick = useCallback( () => {
		if ( showUpsellBadge ) {
			// We don't want to show the clicked state when the upsell modal is opened.
			// Open the upsell modal.
		} else {
			setIsClicked( true );
			const index = blockInsertionPoint.index;
			/*
			 Get the block from the editor with this index.
			 We use index - 1 because the blockInsertionPoint index starts from 1.
			 */
			const blockAtIndex = blocks[ index - 1 ];
			const isBlockAtIndexEmpty = blockAtIndex ? blockAtIndex.name === "core/paragraph" && blockAtIndex.attributes.content?.text === "" : false;
			const block = createBlock( blockName );
			/*
			 We use a timeout to allow the button to show the clicked state for a short moment.
			 This improves the user experience by providing visual feedback.
			 300ms is chosen as a good balance between responsiveness and visibility of the clicked state.
			 It's long enough for users to notice, but short enough to not feel sluggish.
			 */
			setTimeout( () => {
				if ( isBlockAtIndexEmpty ) {
					/*
					 If the block at the insertion point is an empty paragraph, we want to replace it with the new block.
					 This prevents having an empty paragraph above the newly inserted block.
					 This is usually the case when the user hits the enter key to create a new block.
					 The newly created block is an empty paragraph by default
					 */
					replaceBlock( blockAtIndex.clientId, block );
				} else {
					insertBlock( block, index );
				}
				setIsClicked( false );
			}, 300 );
		}
	}, [ showUpsellBadge, blockName, insertBlock, replaceBlock, blockInsertionPoint, blocks ] );

	const handleMouseEnter = useCallback( () => {
		setShowTooltip( true );
	}, [] );

	const handleMouseLeave = useCallback( () => {
		setShowTooltip( false );
	}, [] );

	const buttonClass = `yoast-add-block-button${isClicked ? " yoast-add-block-button--clicked" : ""}${showTooltip && ! isClicked ? " yoast-tooltip yoast-tooltip-w" : ""}`;
	const plusIconClass = `yoast-add-block-button__icon${isClicked ? " yoast-add-block-button__icon--clicked" : ""}`;

	const ariaLabel = showTooltip
		? __( "Add block to content.", "wordpress-seo" )
		: __( "Add block", "wordpress-seo" );

	return (
		<button
			className={ buttonClass }
			aria-label={ ariaLabel }
			onClick={ handleButtonClick }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<PlusIcon className={ plusIconClass } />
		</button>
	);
};

AddBlockButton.propTypes = {
	showUpsellBadge: PropTypes.bool.isRequired,
	blockName: PropTypes.string.isRequired,
};
