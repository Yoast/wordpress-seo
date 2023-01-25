import { ReactElement } from "react";
import { createElement, Fragment } from "@wordpress/element";
import {
	registerBlockType,
	BlockConfiguration,
	BlockEditProps,
	BlockSaveProps,
} from "@wordpress/blocks";
import { InspectorControls, BlockIcon } from "@wordpress/block-editor";
import { select } from "@wordpress/data";
import { PanelBody } from "@wordpress/components";

import BlockInstruction from "./BlockInstruction";
import Definition from "../Definition";
import BlockRootLeaf from "../../leaves/blocks/BlockRootLeaf";
import parse from "../../functions/blocks/parse";
import { registerBlockDefinition } from "./BlockDefinitionRepository";
import logger from "../../functions/logger";
import { openGeneralSidebar } from "../../functions/gutenberg/sidebar";

export interface RenderEditProps extends BlockEditProps<Record<string, unknown>> {
	clientId: string;
	name?: string;
}

export interface RenderSaveProps extends BlockSaveProps<Record<string, unknown>> {
	clientId?: string;
	className?: string;
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
		if ( select( "core/block-editor" ).isBlockSelected( props.clientId ) ) {
			openGeneralSidebar( "edit-post/block", true );
		}

		const sidebarElements = this.sidebarElements( props );

		// Take the children directly to avoid creating too many Fragments.
		const elements = this.tree.children.map( ( leaf, i ) => leaf.edit( props, i ) ).filter( e => e !== null );

		if ( sidebarElements.length > 0 ) {
			const sidebarContainer =
				<InspectorControls key="sidebar-inspector-controls">
					<PanelBody>
						{ sidebarElements }
					</PanelBody>
				</InspectorControls>;

			elements.unshift( sidebarContainer );
		}

		if ( elements.length === 1 ) {
			return elements[ 0 ] as ReactElement;
		}

		return createElement( Fragment, { key: props.clientId }, elements.map( ( element, i ) => createElement( Fragment, { key: i }, element ) ) );
	}

	/**
	 * Renders the persisted block.
	 *
	 * @param props The props.
	 *
	 * @returns The rendered block.
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

		logger.debug( "registering block " + name );

		if ( configuration.icon && typeof configuration.icon === "string" && configuration.icon.startsWith( "<svg" ) ) {
			configuration.icon = this.createBlockIcon( configuration );
		}

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
	 * @returns The sidebar element to render.
	 */
	sidebarElements( props: RenderEditProps ): ReactElement[] {
		return Object.values( this.instructions )
			.map( ( instruction, index ) => <Fragment key={ instruction.id }>
				{ instruction.sidebar( props, index ) }
			</Fragment> )
			.filter( e => e !== null );
	}

	/**
	 * Creates a block icon.
	 *
	 * @param configuration The block configuration.
	 *
	 * @returns The sidebar element to render.
	 */
	private createBlockIcon( configuration: MutableBlockConfiguration ): ReactElement {
		const icon = <span
			className="yoast-schema-blocks-icon"
			dangerouslySetInnerHTML={ { __html: configuration.icon as string } }
		/>;

		return <BlockIcon icon={ icon } />;
	}
}
