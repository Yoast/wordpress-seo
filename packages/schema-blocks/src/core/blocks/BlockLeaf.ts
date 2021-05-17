import { RenderEditProps, RenderSaveProps } from "./BlockDefinition";
import Leaf from "../Leaf";

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
}
