import { useDispatch, useSelect } from "@wordpress/data";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- __experimentalBlockVariationPicker is defined in the package, though no type info is available.
import { __experimentalBlockVariationPicker as ExperimentalBlockVariationPicker, useBlockProps } from "@wordpress/block-editor";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { get, map } from "lodash";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, useCallback } from "@wordpress/element";
import { VariationInterface } from "../../instructions/blocks/Variation";
import { RenderEditProps } from "../..";

/**
 * Creates the blocks from the inner block templates.
 *
 * @param innerBlocksTemplate The inner blocks template.
 *
 * @returns The created blocks.
 */
function createBlocksFromInnerBlocksTemplate( innerBlocksTemplate: BlockInstance[] ): BlockInstance[] {
	return map(
		innerBlocksTemplate,
		( { name, attributes = {}, innerBlocks = [] } ) =>
			createBlock(
				name,
				attributes,
				createBlocksFromInnerBlocksTemplate( innerBlocks ),
			),
	);
}

/**
 * Renders the variation picker.
 *
 * @param props The props.
 *
 * @returns {ReactElement} The component.
 */
export default function VariationPickerPresenter( { clientId, name, setAttributes }: RenderEditProps ): React.ReactElement {
	const { blockType, defaultVariation, variations } = useSelect(
		select => {
			const {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore -- getBlockVariations is defined in the package, though no type info is available.
				getBlockVariations,
				getBlockType,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore -- getDefaultBlockVariation is defined in the package, though no type info is available.
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
	const blockProps = useBlockProps();

	/**
	 * Creates the block that is selected in the variation picker.
	 *
	 * @param nextVariation The variation that is selected by the user.
	 */
	const onSelect = useCallback( ( nextVariation = defaultVariation ) => {
		if ( nextVariation.attributes ) {
			setAttributes( nextVariation.attributes );
		}

		if ( nextVariation.innerBlocks ) {
			replaceInnerBlocks(
				clientId,
				createBlocksFromInnerBlocksTemplate(
					nextVariation.innerBlocks,
				),
				true,
			);
		}
	}, null );

	return (
		<div { ...blockProps }>
			<ExperimentalBlockVariationPicker
				icon={ false }
				label={ get( blockType, [ "title" ] ) }
				variations={ variations.map( ( variation: VariationInterface ) => {
					return { ...variation, icon: <span dangerouslySetInnerHTML={ { __html: variation.icon } } /> };
				} ) }
				onSelect={ onSelect }
				allowSkip={ false }
			/>
		</div>
	);
}
