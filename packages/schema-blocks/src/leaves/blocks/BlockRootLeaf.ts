import BlockLeaf from "../../core/blocks/BlockLeaf";
import { createElement, Fragment } from "@wordpress/element";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";

/**
 * BlockRootLeaf class.
 */
export default class BlockRootLeaf extends BlockLeaf {
	public children: BlockLeaf[];

	/**
     * Constructs a block root leaf.
     *
     * @param children The children.
     */
	constructor( children: BlockLeaf[] ) {
		super();
		this.children = children;
	}

	/**
	 * Renders saving a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	save( props: RenderSaveProps ): JSX.Element {
		return createElement( Fragment, null, this.renderChildren( this.children, props, "save" ) );
	}

	/**
	 * Renders editing a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		return createElement( Fragment, null, this.renderChildren( this.children, props, "edit" ) );
	}
}
