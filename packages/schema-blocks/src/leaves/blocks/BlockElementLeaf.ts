import BlockLeaf from "../../core/blocks/BlockLeaf";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { createElement } from "@wordpress/element";
import { AllHTMLAttributes } from "react";

const attributeMap: Record<string, keyof AllHTMLAttributes<unknown>> = { "class": "className", "for": "htmlFor" };

/**
 * BlockElementLeaf class.
 */
export default class BlockElementLeaf extends BlockLeaf {
	public tag: string;
	public attributes: Record<keyof AllHTMLAttributes<unknown>, BlockLeaf[]>;
	public children: BlockLeaf[];

	/**
     * Creates an element leaf.
     *
     * @param tag        The tag.
     * @param attributes The attributes.
     * @param children   The children.
     */
	constructor(
		tag: string,
		attributes: Record<string, BlockLeaf[]> = {},
		children: BlockLeaf[] = [],
	) {
		super();
		this.tag        = tag;
		this.attributes = attributes;
		this.children   = children;
	}

	/**
	 * Renders editing a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	save( props: RenderSaveProps, i: number ): JSX.Element {
		const attributes: React.ClassAttributes<unknown> & AllHTMLAttributes<unknown> = {};
		for ( const key in this.attributes ) {
			if ( Object.prototype.hasOwnProperty.call( attributes, key ) ) {
				continue;
			}

			const fixedKey = attributeMap[ key ] || key as keyof AllHTMLAttributes<unknown>;
			attributes[ fixedKey ] = this.attributes[ key as keyof AllHTMLAttributes<unknown> ]
				.map( ( leaf, index ) => leaf.save( props, index ) ).join( "" ) as never;
		}

		attributes.key = i;

		return createElement( this.tag, attributes, this.renderChildren( this.children, props, "save" ) );
	}

	/**
	 * Renders saving a leaf.
	 *
	 * @param props The render props.
	 * @param i     The number child this leaf is.
	 *
	 * @returns The rendered element.
	 */
	edit( props: RenderEditProps, i: number ): JSX.Element {
		const attributes: React.ClassAttributes<unknown> & AllHTMLAttributes<unknown> = {};
		for ( const key in this.attributes ) {
			if ( Object.prototype.hasOwnProperty.call( attributes, key ) ) {
				continue;
			}

			const fixedKey = attributeMap[ key ] || key as keyof AllHTMLAttributes<unknown>;
			attributes[ fixedKey ] = this.attributes[ key as keyof AllHTMLAttributes<unknown> ]
				.map( ( leaf, index ) => leaf.edit( props, index ) ).join( "" ) as never;
		}
		if ( [ "button", "a" ].indexOf( this.tag ) !== -1 ) {
			attributes.onClick = e => {
				e.preventDefault();
				return false;
			};
		}

		attributes.key = i;

		return createElement( this.tag, attributes, this.renderChildren( this.children, props, "edit" ) );
	}
}
