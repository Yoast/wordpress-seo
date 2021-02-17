import { TextControl } from "@wordpress/components";
import { createElement } from "@wordpress/element";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { useCallback } from "react";
import { BlockConfiguration } from "@wordpress/blocks";

/**
 * The text input instruction.
 */
export default class TextInput extends BlockInstruction {
	public options: {
		name: string;
		type: string;
		label: string;
		hideLabelFromVision: boolean;
		placeholder: string;
	}

	/**
	 * Renders editing the instruction.
	 *
	 * @param props The props.
	 *
	 * @returns The rendered instruction.
	 */
	edit( props: RenderEditProps ): React.ReactElement | string {
		const { hideLabelFromVision, label, type, placeholder } = this.options;

		const value = props.attributes[ this.options.name ] as string;

		const onChange = useCallback(
			newValue => {
				props.setAttributes( { [ this.options.name ]: newValue } );
			},
			[ props ],
		);

		return <TextControl
			className={ props.className }
			hideLabelFromVision={ hideLabelFromVision }
			label={ label }
			onChange={ onChange }
			type={ type }
			placeholder={ placeholder }
			value={ value }
		/>;
	}

	/**
	 * Renders saving the instruction.
	 *
	 * @param props The props.
	 *
	 * @returns The element to render.
	 */
	save( props: RenderSaveProps ): React.ReactElement | string {
		return props.attributes[ this.options.name ] as string;
	}

	/**
	 * Adds the select to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: "string",
				},
			},
		};
	}
}

BlockInstruction.register( "text-input", TextInput );

