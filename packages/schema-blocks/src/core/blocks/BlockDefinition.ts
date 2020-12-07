import { createElement, Fragment } from "@wordpress/element";
import { registerBlockType, BlockConfiguration, BlockEditProps, BlockSaveProps } from "@wordpress/blocks";
import { InspectorControls } from "@wordpress/block-editor";
import BlockInstruction from "./BlockInstruction";
import Definition from "../Definition";
import BlockRootLeaf from "../../leaves/blocks/BlockRootLeaf";
import parse from "../../functions/blocks/parse";
import { registerBlockDefinition } from "./BlockDefinitionRepository";

export interface RenderEditProps extends BlockEditProps<Record<string, unknown>> {
	clientId?: string;
}

export interface RenderSaveProps extends BlockSaveProps<Record<string, unknown>> {
	clientId?: string;
}

export type MutableBlockConfiguration = {
	-readonly [K in keyof BlockConfiguration]: BlockConfiguration[K]
}

/**
 * BlockDefinition class
 */
export default class BlockDefinition extends Definition {
	public static separatorCharacters = [ "@", "#", "$", "%", "^", "&", "*", "(", ")", "{", "}", "[", "]" ];
	public static parser = parse;

	public instructions: Record<string, BlockInstruction>;
	public tree: BlockRootLeaf;

	/**
	 * Renders editing the block.
	 *
	 * @param props The props.
	 *
	 * @returns The rendered block.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		// Take the children directly to avoid creating too many Fragments.
		const elements = this.tree.children.map( ( leaf, i ) => leaf.edit( props, i ) ).filter( e => e !== null );

		const sidebarElements = Object.values( this.instructions )
			.map( ( instruction, i ) => instruction.sidebar( props, i ) )
			.filter( e => e !== null );
		if ( sidebarElements.length > 0 ) {
			const sidebar = createElement( InspectorControls, null, sidebarElements );
			elements.unshift( sidebar );
		}

		if ( elements.length === 1 ) {
			return elements[ 0 ] as JSX.Element;
		}

		return createElement( Fragment, null, elements );
	}

	/**
	 * Renders saving the block.
	 *
	 * @param props The props.
	 *
	 * @returns The rendered block.
	 */
	save( props: RenderSaveProps ): JSX.Element {
		return this.tree.save( props );
	}

	/**
	 * Registers the block with Gutenberg.
	 */
	register(): void {
		const configuration = this.configuration() as MutableBlockConfiguration;

		const name = configuration.name as string;
		delete configuration.name;

		configuration.edit = props => this.edit( props );
		configuration.save = props => this.save( props );

		// Register the block to WordPress.
		registerBlockType( name, configuration );
		// Register the block with our own code.
		registerBlockDefinition( name, this );
	}
}
