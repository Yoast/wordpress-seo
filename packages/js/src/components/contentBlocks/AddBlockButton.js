import { CheckIcon, PlusIcon } from "@heroicons/react/outline";
import { createBlock } from "@wordpress/blocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * AddBlockButton component to render the 'add block' button.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.showUpsellBadge Whether to show the upsell badge.
 * @param {string} props.blockName The name of the block to insert.
 * @param {boolean} props.doesSupportMultiple Whether the block supports multiple instances.
 * @returns {JSX.Element} The AddBlockButton component.
 */
export const AddBlockButton = ( { showUpsellBadge, blockName, doesSupportMultiple } ) => {
	const addedBlock = useSelect( ( select ) => select( "core/block-editor" ).getBlocksByName( blockName ), [ blockName ] );
	const { insertBlock } = useDispatch( "core/block-editor" );
	const [ isBlockAdded, setIsBlockAdded ] = useState( false );

	const handleButtonClick = useCallback( () => {
		if ( showUpsellBadge ) {
			// Open the upsell modal.
		} else {
			const block = createBlock( `${ blockName }` );
			insertBlock( block );
			setIsBlockAdded( true );
		}
	}, [ showUpsellBadge, blockName ] );

	useEffect( () => {
		// If no block is found, set isBlockAdded to false.
		if ( addedBlock.length === 0 ) {
			setIsBlockAdded( false );
		} else {
			/*
			 This is also to make sure the button shows the check icon if the block is already present
			 on the initial render or when the block is added via different means.
			 */
			setIsBlockAdded( true );
		}
	}, [ addedBlock ] );
	// If the block doesn't support multiple instances and is already added, disable the button.
	const isButtonDisabled = useMemo( () => ! doesSupportMultiple && isBlockAdded, [ doesSupportMultiple, isBlockAdded ] );

	return (
		<button
			className="yst-box-border yst-flex yst-flex-row yst-justify-center yst-items-center yst-p-1.5 yst-gap-1.5 yst-w-7 yst-h-7 yst-bg-white yst-border yst-border-solid yst-border-slate-300 yst-shadow-sm yst-rounded-md"
			aria-label={ __( "Add block", "wordpress-seo" ) }
			onClick={ handleButtonClick }
			disabled={ isButtonDisabled }
		>
			{ /* Show check icon if a block is added, otherwise show plus icon */ }
			{ isBlockAdded
				? <CheckIcon className="yst-h-4 yst-w-4 yst-text-green-600" />
				: <PlusIcon className="yst-h-4 yst-w-4" />
			}
		</button>
	);
};

AddBlockButton.propTypes = {
	showUpsellBadge: PropTypes.bool.isRequired,
	blockName: PropTypes.string.isRequired,
	doesSupportMultiple: PropTypes.bool.isRequired,
};
