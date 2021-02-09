import BlockInstruction from "../../core/blocks/BlockInstruction";
import { select, useDispatch, useSelect } from "@wordpress/data";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import BlockLeaf from "../../core/blocks/BlockLeaf";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore -- __experimentalBlockVariationPicker is defined in the package, though no type info is available.
import { __experimentalBlockVariationPicker as ExperimentalBlockVariationPicker, useBlockProps } from "@wordpress/block-editor";
import { get, map } from "lodash";
import { createBlock } from "@wordpress/blocks";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "@wordpress/element";
import { BlockInstance } from "@wordpress/blocks";
import { VariationInterface } from "./Variation";

/**
 * VariationPicker instruction.
 */
class VariationPicker extends BlockInstruction {
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
	edit( props: RenderEditProps, leaf: BlockLeaf, index: number ) {
		const { clientId } = props;
		const hasInnerBlocks = select( "core/block-editor" ).getBlock( clientId ).innerBlocks.length > 0;

		if ( hasInnerBlocks ) {
			return null;
		}

		return this.renderVariationPicker( props, "variation-picker-" + index );
	}

	/**
	 * Creates the blocks from the inner block templates.
	 *
	 * @param innerBlocksTemplate The inner blocks template.
	 *
	 * @returns The created blocks.
	 */
	createBlocksFromInnerBlocksTemplate = ( innerBlocksTemplate: BlockInstance[] ): BlockInstance[] => {
		return map(
			innerBlocksTemplate,
			( { name, attributes = {}, innerBlocks = [] } ) =>
				createBlock(
					name,
					attributes,
					this.createBlocksFromInnerBlocksTemplate( innerBlocks ),
				),
		);
	};

	/**
	 * Renders the variation picker.
	 *
	 * @param props The render edit props.
	 * @param key   The variation picker's key.
	 *
	 * @returns The variation picker.
	 */
	renderVariationPicker( props: RenderEditProps, key: string ) {
		const { blockType, defaultVariation, variations } = useSelect(
			( selectStore ) => {
				const {
					// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
					// @ts-ignore -- getBlockVariations is defined in the package, though no type info is available.
					getBlockVariations,
					getBlockType,
					// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
					// @ts-ignore -- getDefaultBlockVariation is defined in the package, though no type info is available.
					getDefaultBlockVariation,
				} = selectStore( "core/blocks" );

				return {
					blockType: getBlockType( props.name ),
					defaultVariation: getDefaultBlockVariation( props.name, "block" ),
					variations: getBlockVariations( props.name, "block" ),
				};
			},
			[ props.name ],
		);

		const { replaceInnerBlocks } = useDispatch( "core/block-editor" );
		const blockProps = useBlockProps();

		/**
		 * Creates the block that is selected in the variation picker.
		 *
		 * @param nextVariation The variation that is selected by the user.
		 */
		const onSelect = ( nextVariation = defaultVariation ) => {
			if ( nextVariation.attributes ) {
				props.setAttributes( nextVariation.attributes );
			}

			if ( nextVariation.innerBlocks ) {
				replaceInnerBlocks(
					props.clientId,
					this.createBlocksFromInnerBlocksTemplate(
						nextVariation.innerBlocks,
					),
					true,
				);
			}
		};

		return (
			<div key={ key } { ...blockProps }>
				<ExperimentalBlockVariationPicker
					icon={ false }
					label={ get( blockType, [ "title" ] ) }
					variations={ variations.map( ( variation: VariationInterface ) => {
						return { ...variation, icon: <span dangerouslySetInnerHTML={ { __html: variation.icon } } /> };
					} ) }
					onSelect={ onSelect }
					allowSkip={ true }
				/>
			</div>
		);
	}
}

BlockInstruction.register( "variation-picker", VariationPicker );
