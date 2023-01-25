import { useSelect } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { BlockLeaf, BlockInstruction } from "../../core/blocks";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import { BlockPresence, BlockValidation, BlockValidationResult } from "../../core/validation";
import VariationPickerPresenter from "../../functions/presenters/VariationPickerPresenter";
import { getParent } from "../../functions/gutenberg/block";
import { getPresence } from "../../functions/validators/getPresence";

/**
 * Helper function to check whether the block instance includes a picked variation.
 *
 * @param blockInstance The block instance to check.
 *
 * @returns Whether the block instance includes a variation.
 */
function includesAVariation( blockInstance: BlockInstance ): boolean {
	return blockInstance.innerBlocks && blockInstance.innerBlocks.length > 0;
}

/**
 * VariationPicker instruction.
 */
export class VariationPicker extends BlockInstruction {
	/**
	 * Renders the variation picker if the block doesn't have any inner blocks.
	 * Otherwise, renders null.
	 *
	 * @param props The render edit props.
	 * @param leaf  The leaf being rendered.
	 * @param index The number the rendered element is of its parent.
	 *
	 * @returns The variation picker or null.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, index: number ): React.ReactElement {
		const { innerBlocks } = useSelect(
			select => select( "core/block-editor" ).getBlock( props.clientId ),
			[ props.clientId ],
		);
		const hasInnerBlocks = innerBlocks.length > 0;

		if ( hasInnerBlocks ) {
			return null;
		}

		return <VariationPickerPresenter { ...props } key={ "variation-picker-" + index } />;
	}

	/**
	 * Checks if the variation picker instruction is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const presence = getPresence( this.options );
		const parent = getParent( blockInstance.clientId );
		const blockName = parent ? parent.name : this.constructor.name;

		if ( includesAVariation( blockInstance ) ) {
			return BlockValidationResult.Valid( blockInstance, blockName, presence );
		}

		const result = presence === BlockPresence.Required ? BlockValidation.MissingRequiredVariation : BlockValidation.MissingRecommendedVariation;
		return new BlockValidationResult( blockInstance.clientId, blockName, result, presence );
	}
}

BlockInstruction.register( "variation-picker", VariationPicker );
