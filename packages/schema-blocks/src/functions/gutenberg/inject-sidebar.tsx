import { InspectorControls } from "@wordpress/block-editor";
import { BlockEditProps } from "@wordpress/blocks";
import { createElement, Fragment } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { MutableBlockConfiguration } from "../../core/blocks/BlockDefinition";
import getParentSidebar from "../blocks/getParentSidebar";

/**
 * Injects the sidebar from our blocks into other blocks.
 *
 * @param blockNames The block names to inject the sidebar into.
 * @param parents    The parent names to inject the sidebar from.
 */
export default function injectSidebar( blockNames: string[], parents: string[] ): void {
	addFilter(
		"blocks.registerBlockType",
		"yoast/wordpress-seo/injectSidebar",
		( settings: MutableBlockConfiguration, name: string ) => {
			if ( ! blockNames.includes( name ) ) {
				return settings;
			}

			const OriginalEdit = settings.edit;
			settings.edit = function enhancedEdit( props: BlockEditProps<unknown> ) {
				return <Fragment>
					<OriginalEdit { ...props } />
					<InspectorControls>
						{ getParentSidebar( props, parents ) }
					</InspectorControls>
				</Fragment>;
			};

			return settings;
		},
	);
}
