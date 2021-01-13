import BlockInstruction from "../../core/blocks/BlockInstruction";
import { useSelect, useDispatch } from "@wordpress/data";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore -- __experimentalBlockVariationPicker is defined in the package, though no type info is available.
import { __experimentalBlockVariationPicker } from "@wordpress/block-editor";
import { get, map } from "lodash";
import { createBlock } from "@wordpress/blocks";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "@wordpress/element";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Creates the blocks from the inner block templates.
 *
 * @param innerBlocksTemplate The inner blocks template.
 *
 * @returns The created blocks.
 */
const createBlocksFromInnerBlocksTemplate = ( innerBlocksTemplate: BlockInstance[] ): BlockInstance[] => {
	return map(
		innerBlocksTemplate,
		( { name, attributes, innerBlocks = [] } ) =>
			createBlock(
				name,
				attributes,
				createBlocksFromInnerBlocksTemplate( innerBlocks ),
			),
	);
};

/**
 * VariationPicker instruction.
 */
class VariationPicker extends BlockInstruction {
	/**
	 * Renders the variation picker.
	 *
	 * @param {RenderEditProps} props The render edit props.
	 *
	 * @returns The variation picker.
	 */
	edit( props: RenderEditProps ) {
		const { blockType, defaultVariation, variations } = useSelect(
			( select ) => {
				const {
					// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
					// @ts-ignore -- getBlockVariations is defined in the package, though no type info is available.
					getBlockVariations,
					getBlockType,
					// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
					// @ts-ignore -- getDefaultBlockVariation is defined in the package, though no type info is available.
					getDefaultBlockVariation,
				} = select( "core/blocks" );

				return {
					blockType: getBlockType( props.name ),
					defaultVariation: getDefaultBlockVariation( props.name, "block" ),
					variations: getBlockVariations( props.name, "block" ),
				};
			},
			[ props.name ],
		);
		const { replaceInnerBlocks } = useDispatch( "core/block-editor" );

		return (
			<__experimentalBlockVariationPicker
				icon={ get( blockType, [ "icon", "src" ] ) }
				label={ get( blockType, [ "title" ] ) }
				variations={ variations }
				onSelect={ ( nextVariation = defaultVariation ) => {
					if ( nextVariation.attributes ) {
						props.setAttributes( nextVariation.attributes );
					}
					if ( nextVariation.innerBlocks ) {
						replaceInnerBlocks(
							props.clientId,
							createBlocksFromInnerBlocksTemplate(
								nextVariation.innerBlocks,
							),
						);
					}
				} }
				allowSkip={ true }
			/>
		);
	}
}

BlockInstruction.register( "variation-picker", VariationPicker );
