import { ReactElement } from "react";
import { createElement } from "@wordpress/element";
import { BlockInstance } from "@wordpress/blocks";
import BlockSuggestions from "../../blocks/BlockSuggestions";
import { __ } from "@wordpress/i18n";
import getWarnings, { sidebarWarning } from "./SidebarWarningPresenter";
import { InnerBlocksInstructionOptions } from "../../instructions/blocks/InnerBlocksInstructionOptions";
import { SvgIcon } from "@yoast/components";

/**
 * Renders warnings and appenders for any block's InnerBlocks.
 *
 * @param currentBlock The innerblocks instance.
 * @param options The InnerBlocksInstructionOptions of the innerblock.
 *
 * @returns {ReactElement[]} React Elements representing the sidebar elements for these innerblocks.
 */
export function innerBlocksSidebar( currentBlock: BlockInstance, options: InnerBlocksInstructionOptions ): ReactElement[] {
	const elements: ReactElement[] = [];

	const warnings = getWarnings( currentBlock.clientId );
	if ( warnings && warnings.length > 0 ) {
		elements.push( createWarningList( warnings ) );
	}

	if ( options.requiredBlocks ) {
		elements.push( BlockSuggestions( __( "Required Blocks", "yoast-schema-blocks" ), currentBlock, options.requiredBlocks ) );
	}

	if ( options.recommendedBlocks ) {
		elements.push( BlockSuggestions( __( "Recommended Blocks", "yoast-schema-blocks" ), currentBlock, options.recommendedBlocks ) );
	}

	return elements;
}

/**
 * Renders a ReactElement containing the list of warnings.
 *
 * @param warnings All warnings for this innerblock instance.
 *
 * @returns {ReactElement} A ReactElement containing the list of warnings.
 */
function createWarningList( warnings: sidebarWarning[] ): ReactElement {
	return (
		<div className="yoast-block-sidebar-warnings">
			<div className="yoast-block-sidebar-title">{ __( "Analysis", "yoast-schema-blocks" ) }</div>
			<ul className="yoast-block-sidebar-warnings"> { }
				{ ...warnings.map( warning => createWarningElement( warning.text, warning.color ) ) }
			</ul>
		</div>
	);
}

/**
 * Creates a React element for a warning message
 *
 * @param warning The warning message.
 * @param color The bubble color.
 *
 * @returns {ReactElement} The formatted warning message.
 */
function createWarningElement( warning: string, color = "red" ): ReactElement {
	return (
		<li className="yoast-block-sidebar-warning">
			<SvgIcon
				icon="circle"
				color={ color }
				size="13px"
				className="yoast-block-sidebar-warning-dot"
			/>{ warning }
		</li>
	);
}
