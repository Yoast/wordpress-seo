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

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 * @param i     The number the rendered element is of its parent.
	 *
	 * @returns {ReactElement} The sidebar element to render.
	 */
	sidebar( props: RenderEditProps, i: number ): JSX.Element | string {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

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
