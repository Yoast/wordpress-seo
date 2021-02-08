import BlockInstruction from "../../core/blocks/BlockInstruction";
import { BlockConfiguration } from "@wordpress/blocks";
import { CheckboxControl } from "@wordpress/components";
import { createElement, useCallback } from "@wordpress/element";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";

/**
 * Shows a checkbox in the sidebar.
 */
class SidebarCheckbox extends BlockInstruction {
	public options: {
		/**
		 * The attribute name the checkbox value should be saved as.
		 */
		name: string;
		/**
		 * The label that should be shown before this checkbox control.
		 */
		label: string;
		/**
		 * Optional help text.
		 */
		help?: string;
		/**
		 * An optional extra class name or class names.
		 */
		className?: string;
		/**
		 * An optional string that should be output on the website's frontend
		 * when this checkbox is checked.
		 */
		output?: string;
	};

	/**
	 * Renders the sidebar.
	 *
	 * @param props The render props.
	 *
	 * @returns The sidebar element.
	 */
	sidebar( props: RenderEditProps ): JSX.Element {
		const { name, label, help } = this.options;

		/**
		 * Function that is called whenever the checkbox changes.
		 *
		 * @param event The change event.
		 */
		const onChange = useCallback(
			newValue => {
				props.setAttributes( { [ this.options.name ]: newValue } );
			},
			[ props ],
		);

		return <CheckboxControl
			checked={ props.attributes[ name ] as boolean }
			label={ label }
			onChange={ onChange }
			help={ help }
		/>;
	}

	/**
	 * Renders saving the element.
	 *
	 * @param props The props.
	 *
	 * @returns {JSX.Element} The element to render.
	 */
	save( props: RenderSaveProps ): JSX.Element | string {
		const isChecked = props.attributes[ this.options.name ];
		if ( isChecked && this.options.output ) {
			return this.options.output;
		}
		return null;
	}

	/**
	 * Adds the sidebar checkbox to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: "boolean",
				},
			},
		};
	}
}

BlockInstruction.register( "sidebar-checkbox", SidebarCheckbox );
