import BlockInstruction from "../../core/blocks/BlockInstruction";
import { useSelect, useDispatch } from "@wordpress/data";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import { __experimentalBlockVariationPicker } from "@wordpress/block-editor"; // Maybe update package version
import { get, map } from "lodash";
import { createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";


const createBlocksFromInnerBlocksTemplate = ( innerBlocksTemplate ) => {
	return map(
		innerBlocksTemplate,
		( [ name, attributes, innerBlocks = [] ] ) =>
			createBlock(
				name,
				attributes,
				createBlocksFromInnerBlocksTemplate( innerBlocks )
			)
	);
};

/**
 * VariationPicker instruction.
 */
class VariationPicker extends BlockInstruction {
	/**
	 * Passes on the options as configuration.
	 *
	 * @returns The configuration.
	 */
	edit( props: RenderEditProps ) {
		const { blockType, defaultVariation, variations } = useSelect(
			( select ) => {
				const {
					getBlockVariations,
					getBlockType,
					getDefaultBlockVariation,
				} = select( "core/blocks" );

				return {
					blockType: getBlockType( name ),
					defaultVariation: getDefaultBlockVariation( name, "block" ),
					variations: getBlockVariations( name, "block" ),
				};
			},
			[ name ],
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
