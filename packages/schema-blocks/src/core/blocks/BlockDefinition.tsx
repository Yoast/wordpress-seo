import { ReactElement } from "react";
import { createElement, Fragment } from "@wordpress/element";
import { registerBlockType, BlockConfiguration, BlockEditProps, BlockSaveProps } from "@wordpress/blocks";
import { InspectorControls } from "@wordpress/block-editor";
import BlockInstruction from "./BlockInstruction";
import Definition from "../Definition";
import BlockRootLeaf from "../../leaves/blocks/BlockRootLeaf";
import parse from "../../functions/blocks/parse";
import { registerBlockDefinition } from "./BlockDefinitionRepository";
import { PanelBody } from "@wordpress/components";
import logger from "../../functions/logger";
import { openGeneralSidebar } from "../../functions/gutenberg/sidebar";

export interface RenderEditProps extends BlockEditProps<Record<string, unknown>> {
	clientId: string;
	name?: string;
}

export interface RenderSaveProps extends BlockSaveProps<Record<string, unknown>> {
	clientId?: string;
}

export type MutableBlockConfiguration = {
	-readonly [K in keyof BlockConfiguration]: BlockConfiguration[K]
}

/**
 * BlockDefinition class.
 */
export default class BlockDefinition extends Definition {
	public static separatorCharacters = [ "b", "c", "d", "f", "g", "h", "k", "m", "z" ];
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
	edit( props: RenderEditProps ): ReactElement {
		// Force the sidebar open.
		openGeneralSidebar( "edit-post/block", true );

		const sidebarElements = this.sidebarElements( props );

		// Take the children directly to avoid creating too many Fragments.
		const elements = this.tree.children.map( ( leaf, i ) => leaf.edit( props, i ) ).filter( e => e !== null );

		if ( sidebarElements.length > 0 ) {
			// Need to add `children` on the `props` as well, because of the type definition of `InspectorControls.Props`.
			const sidebar = createElement( PanelBody, { key: "sidebarPanelBody", children: sidebarElements }, sidebarElements );
			const sidebarContainer = createElement( InspectorControls, { key: "sidebar", children: [ sidebar ] }, [ sidebar ] );
			elements.unshift( sidebarContainer );
		}

		if ( elements.length === 1 ) {
			return elements[ 0 ] as ReactElement;
		}

		return createElement( Fragment, { key: props.clientId }, elements );
	}

	/**
	 * Renders the persisted block.
	 *
	 * @param props The props.
	 *
	 * @returns {ReactElement} The rendered block.
	 */
	save( props: RenderSaveProps ): ReactElement {
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

		logger.info( "registering block " + name );

		// Register the block to WordPress.
		registerBlockType( name, configuration );
		// Register the block with our own code.
		registerBlockDefinition( name, this );
	}

	/**
	 * Creates the sidebar elements.
	 *
	 * @param props The properties of the block to create a sidebar for.
	 *
	 * @returns {ReactElement[]} The sidebar element to render.
	 */
	sidebarElements( props: RenderEditProps ): ReactElement[] {
		return Object.values( this.instructions )
			.map( ( instruction, index ) => instruction.sidebar( props, index ) )
			.filter( e => e !== null );
	}
}
