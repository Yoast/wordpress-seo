import { ReactElement } from "react";
import { BlockInstance } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { createElement, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";

import BlockSuggestions from "./BlockSuggestionsPresenter";
import { createAnalysisMessages, SidebarWarning } from "./SidebarWarningPresenter";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
import { BlockValidationResult } from "../../core/validation";
import logger from "../logger";

interface SchemaAnalysisProps {
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
 * Schema analysis component.
 *
 * @param props The properties.
 *
 * @returns The schema analysis component.
 *
 * @constructor
 */
export function SchemaAnalysis( props: SchemaAnalysisProps ): ReactElement {
	const validationResults = useValidationResults( null );

	let warnings: SidebarWarning[] = [];

	if ( validationResults ) {
		warnings = createAnalysisMessages( validationResults );
		logger.debug( "Warnings:", warnings );
	}

	return <Fragment key={ "schema-analysis" }>
		<WarningList warnings={ warnings } />
		<BlockSuggestions
			heading={ __( "Required information", "yoast-schema-blocks" ) }
			blockNames={ props.requiredBlocks }
		/>
		<BlockSuggestions
			heading={ __( "Recommended information", "yoast-schema-blocks" ) }
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
		<Fragment>
			<div className="yoast-block-sidebar-warnings">
				<div className="yoast-block-sidebar-title">{ __( "Analysis", "yoast-schema-blocks" ) }</div>
				<ul className="yoast-block-sidebar-warnings">
					{...props.warnings.map( warning => <Warning warning={ warning } key={ warning.text } /> )}
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
