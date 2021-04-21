import { ReactElement } from "react";

import { createElement, Fragment } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

import { SvgIcon } from "@yoast/components";

import { createAnalysisMessages, SidebarWarning } from "./SidebarWarningPresenter";
import { ClientIdValidation, YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
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
		const results: ClientIdValidation = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getSchemaBlocksValidationResults();
		if ( ! results ) {
			return null;
		}

		return results[ clientId ];
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
	const block = useBlock( props.currentBlock.clientId );
	const validationResults = useValidationResults( props.currentBlock.clientId );

	let warnings: SidebarWarning[] = [];

	if ( validationResults ) {
		warnings = createAnalysisMessages( validationResults );
	}

	return <Fragment key={ "innerblocks-sidebar-" + block.clientId }>
		<SidebarHeader />
		<WarningList warnings={ warnings } />
		<BlockSuggestions
			title={ __( "Required Blocks", "yoast-schema-blocks" ) }
			block={ block }
			suggestions={ props.requiredBlocks }
		/>
		<BlockSuggestions
			title={ __( "Recommended Blocks", "yoast-schema-blocks" ) }
			block={ block }
			suggestions={ props.recommendedBlocks }
		/>
	</Fragment>;
}

interface WarningListProps {
	warnings: SidebarWarning[];
}

/**
 * Renders a ReactElement containing the sidebar header.
 *
 * @returns A ReactElement containing the sidebar header.
 */
function SidebarHeader(): ReactElement {
	const questionMarkIcon: JSX.Element =
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 20 18" fill="currentColor" height="15" width="22">
			<a href="https://yoa.st/4dk" rel="noopener noreferrer" target="_blank">
				<path
					fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113
				8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"
				/>
			</a>
		</svg>;

	return (
		<div className="yoast-block-sidebar-header">
			<div className="yoast-block-sidebar-title">
				{ __( "Blocks for Schema output", "yoast-schema-blocks" ) }
				<span className="yoast-inline-icon">{ questionMarkIcon }</span>
			</div>
		</div>
	);
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
		<Fragment>
			<div className="yoast-block-sidebar-warnings">
				<div className="yoast-block-sidebar-title">{ __( "Analysis", "yoast-schema-blocks" ) }</div>
				<ul className="yoast-block-sidebar-warnings">
					{ ...props.warnings.map( warning => <Warning warning={ warning } key={ warning.text } /> ) }
				</ul>
			</div>
		</Fragment>
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
