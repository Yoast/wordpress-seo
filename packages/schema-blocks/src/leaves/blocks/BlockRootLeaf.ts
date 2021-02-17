import BlockLeaf from "../../core/blocks/BlockLeaf";
import { createElement, Fragment, ReactElement } from "@wordpress/element";
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
		return createElement( Fragment, null, this.children && this.children.map( ( child, i ) => child.save( props, i ) ) );
	}


	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 * @param i     The number the rendered element is of its parent.
	 *
	 * @returns {ReactElement} The sidebar element to render.
	 */
	sidebar( props: RenderEditProps ): ReactElement {
		return createElement( Fragment, null, this.children && this.children.map( ( child, i ) => child.sidebar( props, i ) ) );
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Renders editing a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	edit( props: RenderEditProps ): JSX.Element {
		return createElement( Fragment, null, this.children && this.children.map( ( child, i ) => child.edit( props, i ) ) );
	}
}
