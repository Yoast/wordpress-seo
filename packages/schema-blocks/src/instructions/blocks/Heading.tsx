import { Fragment } from "react";
import { BlockControls, RichText as WordPressRichText } from "@wordpress/block-editor";
import { BlockConfiguration, BlockInstance } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";

import { BlockInstruction, BlockLeaf } from "../../core/blocks";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { BlockValidationResult } from "../../core/validation";
import RichTextBase, { RichTextEditProps, RichTextSaveProps } from "./abstract/RichTextBase";
import HeadingLevelDropdown from "../../functions/presenters/HeadingLevelDropdown";
import { defaultValidate } from "../../functions/validators/defaultValidate";


/**
 * Heading instruction.
 */
export class Heading extends RichTextBase {
	public options: {
		tags: ( keyof HTMLElementTagNameMap )[] | Record<string, keyof HTMLElementTagNameMap>;
		defaultHeadingLevel: number;
		name: string;
		class: string;
		default: string;
		placeholder: string;
		keepPlaceholderOnFocus?: boolean;
		multiline: boolean;
		label: string;
		value: string;
		required?: boolean;
	};

	/**
	 * Adds the RichText attributes to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: "string",
					source: "html",
					"default": this.options.default,
					selector: `[data-id=${this.options.name}]`,
					required: this.options.required === true,
				},
				[ this.options.name + "_level" ]: {
					type: "number",
				},
			},
		};
	}

	/**
	 * Renders editing the rich text.
	 *
	 * @param props The render props.
	 * @param leaf  The leaf being rendered.
	 * @param i     The number child this is.
	 *
	 * @returns The RichText element.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): JSX.Element {
		const attributes = this.getBaseAttributes( props, i ) as RichTextEditProps;

		attributes.onChange = ( value ) => props.setAttributes( { [ this.options.name ]: value } );
		if ( this.options.placeholder ) {
			attributes.placeholder = this.options.placeholder;
		}

		/**
		 * On change handler for when a different heading level is chosen
		 * via the block controls.
		 *
		 * @param newLevel The chosen heading level.
		 */
		const onHeadingLevelChange = ( newLevel: number ) => {
			props.setAttributes( { [ this.options.name + "_level" ]: newLevel } );
		};

		const headingControl = <BlockControls>
			<HeadingLevelDropdown
				selectedLevel={ this.getHeadingLevel( props ) }
				onChange={ onHeadingLevelChange }
			/>
		</BlockControls>;

		return <Fragment>
			{ headingControl }
			<WordPressRichText { ...attributes } />
		</Fragment>;
	}

	/**
	 * Gets the selected tag name from the props if available.
	 * If not, it falls back to the default tag defined in the options or "h2".
	 *
	 * @param props The props.
	 *
	 * @returns The tag name to use.
	 */
	private getHeadingLevel( props: RenderSaveProps | RenderEditProps ): number {
		const selectedLevel = props.attributes[ this.options.name + "_level" ] as number;
		if ( selectedLevel ) {
			return selectedLevel;
		}
		return this.options.defaultHeadingLevel || 2;
	}

	/**
	 * Gets the base attributes of the rich text.
	 *
	 * @param props The props.
	 * @param i     The number child this is.
	 *
	 * @returns The base attributes.
	 */
	protected getBaseAttributes( props: RenderSaveProps | RenderEditProps, i: number ): RichTextSaveProps | RichTextEditProps {
		return {
			tagName: `h${ this.getHeadingLevel( props ) }` as keyof HTMLElementTagNameMap,
			value: props.attributes[ this.options.name ] as string || this.options.value,
			className: this.options.class,
			"data-id": this.options.name,
			key: i,
		};
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The attributes from the block.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		return defaultValidate( blockInstance, this );
	}
}

BlockInstruction.register( "heading", Heading );
