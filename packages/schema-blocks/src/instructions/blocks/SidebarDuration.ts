import moment from "moment";
import { createElement, Fragment } from "@wordpress/element";
import { TextControl } from "@wordpress/components";
import { BlockEditProps, BlockConfiguration } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderSaveProps, RenderEditProps } from "../../core/blocks/BlockDefinition";
import SidebarBase, { SidebarBaseOptions } from "./abstract/SidebarBase";

/**
 * Updates a duration.
 *
 * @param props    The props.
 * @param name     The attribute name.
 * @param duration The duration.
 */
function updateDuration( props: RenderEditProps, name: string, duration: moment.Duration ) {
	if ( ! duration.isValid() || duration.asMinutes() === 0 ) {
		props.setAttributes( { [ name ]: null } );
		return;
	}
	props.setAttributes( { [ name ]: duration.toISOString() } );
}

/**
 * Sidebar duration instruction.
 */
class SidebarDuration extends SidebarBase {
	public options: SidebarBaseOptions;

	/**
	 * Renders the sidebar.
	 *
	 * @param props The render props.
	 * @param i     The number sidebar element this is.
	 *
	 * @returns The sidebar element.
	 */
	sidebar( props: BlockEditProps<Record<string, unknown>>, i: number ): JSX.Element {
		let labelPrefix = "", duration = moment.duration( NaN );

		if ( typeof props.attributes[ this.options.name ] === "string" ) {
			duration = moment.duration( props.attributes[ this.options.name ] );
		} else if ( typeof this.options.default === "string" ) {
			duration = moment.duration( this.options.default );
		}

		if ( typeof this.options.label === "string" ) {
			labelPrefix = this.options.label + " ";
		}

		const hours   = Math.floor( duration.asHours() );
		const minutes = duration.minutes();

		const hourAttributes: TextControl.Props = {
			label: labelPrefix + __( "hours", "wordpress-seo" ),
			value: isNaN( hours ) || hours === 0 ? "" : hours,
			onChange: value => {
				const newDuration = moment.duration( { hours: parseInt( value, 10 ), minutes: minutes || 0 } );
				updateDuration( props, this.options.name, newDuration );
			},
			type: "number",
			key: "hours",
		};
		const minuteAttributes: TextControl.Props = {
			label: labelPrefix + __( "minutes", "wordpress-seo" ),
			value: isNaN( minutes ) || minutes === 0 ? "" : minutes,
			onChange: value => {
				const newDuration = moment.duration( { hours: hours || 0, minutes: parseInt( value, 10 ) } );
				updateDuration( props, this.options.name, newDuration );
			},
			type: "number",
			key: "minutes",
		};

		if ( this.options.help ) {
			hourAttributes.help = this.options.help;
			minuteAttributes.help = this.options.help;
		}

		return createElement( Fragment, { key: i }, [
			createElement( TextControl, hourAttributes ),
			createElement( TextControl, minuteAttributes ),
		] );
	}

	/**
	 * Adds the sidebar input to the block configuration.
	 *
	 * @returns The block configuration.
	 */
	configuration(): Partial<BlockConfiguration> {
		return {
			attributes: {
				[ this.options.name ]: {
					type: "string",
					required: this.options.required === true,
				},
			},
		};
	}

	/**
	 * Renders the value of a sidebar input.
	 *
	 * @param props The render props.
	 *
	 * @returns The value of the sidebar input.
	 */
	protected value( props: RenderSaveProps | RenderEditProps ): string {
		let duration = moment.duration( NaN );

		if ( typeof props.attributes[ this.options.name ] === "string" ) {
			duration = moment.duration( props.attributes[ this.options.name ] );
		} else if ( typeof this.options.default === "string" ) {
			duration = moment.duration( this.options.default );
		}

		if ( ! duration.isValid() ) {
			return "";
		}

		return duration.humanize();
	}
}

BlockInstruction.register( "sidebar-duration", SidebarDuration );
