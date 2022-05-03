import { RenderEditProps, RenderSaveProps } from "./BlockDefinition";
import Leaf from "../Leaf";
import { createElement, Fragment } from "@wordpress/element";

/**
 * BlockLeaf class
 */
export default abstract class BlockLeaf extends Leaf {
	public parent: BlockLeaf;

	/**
	 * Renders editing a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	abstract save( props: RenderSaveProps, i: number ): JSX.Element | string

	/**
	 * Renders saving a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	abstract edit( props: RenderEditProps, i: number ): JSX.Element | string

	/**
	 * Takes the child leaves and wraps them in a Fragment with a key to prevent key errors.
	 *
	 * @param children The child elements.
	 * @param props    Props to be passed down to the children.
	 * @param type     Whether save or edit should be called on the child leaf.
	 *
	 * @returns The rendered leaf children.
	 */
	protected renderChildren( children: BlockLeaf[], props: RenderSaveProps|RenderEditProps, type: "edit"|"save" ): JSX.Element[] {
		return children.map( ( child, index )  => {
			return createElement( Fragment, { key: index }, child[ type ]( props as any, index ) );
		} );
	}
}
