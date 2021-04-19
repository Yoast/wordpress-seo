import { ReactElement } from "react";

import { createElement, Fragment } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

import { SvgIcon } from "@yoast/components";

import { createAnalysisMessages, SidebarWarning } from "./SidebarWarningPresenter";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
import BlockSuggestions from "./BlockSuggestionsPresenter";
import { BlockValidationResult } from "../../core/validation";

interface InnerBlocksSidebarProps {
	currentBlock: BlockInstance;
	recommendedBlocks: string[];
	requiredBlocks: string[];
}

/**
 * Retrieves the validation results for the block with the given client ID from the Redux store.
 *
 * @param clientId The client ID of the block to retrieve the validation results for.
 *
 * @returns The validation results.
 */
function useValidationResults( clientId: string ): BlockValidationResult {
	return useSelect( select => {
		return select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getValidationResultForClientId( clientId );
	}, [ clientId ] );
}

/**
 * Retrieves the latest block version from the WordPress store.
 *
 * @param clientId The client ID of the block to retrieve the latest version of.
 *
 * @returns The latest version of the block.
 */
function useBlock( clientId: string ): BlockInstance {
	return useSelect( select => select( "core/block-editor" ).getBlock( clientId ), [ clientId ] );
}

/**
 * Inner blocks sidebar component.
 *
 * @param props The properties.
 *
 * @returns The inner blocks sidebar component.
 *
 * @constructor
 */
export function InnerBlocksSidebar( props: InnerBlocksSidebarProps ): ReactElement {
	const validationResults = useValidationResults( props.currentBlock.clientId );

	let warnings: SidebarWarning[] = [];

	if ( validationResults ) {
		warnings = createAnalysisMessages( validationResults );
	}

	return <Fragment>
		<WarningList warnings={ warnings } />
		<BlockSuggestions
			heading={ __( "Required Blocks", "yoast-schema-blocks" ) }
			parentClientId={ props.currentBlock.clientId }
			blockNames={ props.requiredBlocks }
		/>
		<BlockSuggestions
			heading={ __( "Recommended Blocks", "yoast-schema-blocks" ) }
			parentClientId={ props.currentBlock.clientId }
			blockNames={ props.recommendedBlocks }
		/>
	</Fragment>;
}

interface WarningListProps {
	warnings: SidebarWarning[];
}

/**
 * Renders a ReactElement containing the list of warnings.
 *
 * @param props The properties.
 *
 * @returns A ReactElement containing the list of warnings.
 */
function WarningList( props: WarningListProps ): ReactElement {
	return (
		<div className="yoast-block-sidebar-warnings">
			<div className="yoast-block-sidebar-title">{ __( "Analysis", "yoast-schema-blocks" ) }</div>
			<ul className="yoast-block-sidebar-warnings">
				{ ...props.warnings.map( warning => <Warning warning={ warning } key={ warning.text } /> ) }
			</ul>
		</div>
	);
}

interface WarningProps {
	warning: SidebarWarning;
}

/**
 * Creates a React element for a warning message.
 *
 * @param props The properties.
 *
 * @returns The formatted warning message.
 */
function Warning( props: WarningProps ): ReactElement {
	return (
		<li className="yoast-block-sidebar-warning">
			<SvgIcon
				icon="circle"
				color={ props.warning.color }
				size="13px"
				className="yoast-block-sidebar-warning-dot"
			/>{ props.warning.text }
		</li>
	);
}
