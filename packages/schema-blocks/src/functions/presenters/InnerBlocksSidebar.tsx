import { ReactElement } from "react";

import { createElement, Fragment } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

import { SvgIcon } from "@yoast/components";

import { createAnalysisMessages, SidebarWarning } from "./SidebarWarningPresenter";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
import { BlockValidationResult } from "../../core/validation";

type ClientIdValidation = Record<string, BlockValidationResult>;

interface InnerBlocksSidebarProps {
	currentBlock: BlockInstance;
}

/**
 * Retrieves the validation results for the block with the given client ID from the Redux store.
 *
 * @param clientId The client ID of the block to retrieve the validation results for.
 *
 * @returns The validation results.
 */
function useValidationResults( clientId: string ) {
	return useSelect( select => {
		const results: ClientIdValidation = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getSchemaBlocksValidationResults();
		if ( ! results ) {
			return null;
		}

		return results[ clientId ];
	}, [ clientId ] );
}

/**
 * Inner blocks sidebar.
 *
 * @param props The properties.
 *
 * @constructor
 */
export function InnerBlocksSidebar( props: InnerBlocksSidebarProps ) {
	const validationResults = useValidationResults( props.currentBlock.clientId );

	let warnings: SidebarWarning[] = [];

	if ( validationResults ) {
		warnings = createAnalysisMessages( validationResults );
	}

	return <Fragment>
		<WarningList warnings={ warnings } />
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
 * @returns {ReactElement} A ReactElement containing the list of warnings.
 */
function WarningList( props: WarningListProps ): ReactElement {
	return (
		<div className="yoast-block-sidebar-warnings">
			<div className="yoast-block-sidebar-title">{ __( "Analysis", "yoast-schema-blocks" ) }</div>
			<ul className="yoast-block-sidebar-warnings"> { }
				{ ...props.warnings.map( warning => <Warning warning={ warning } key={ warning.text } /> ) }
			</ul>
		</div>
	);
}

interface WarningProps {
	warning: SidebarWarning;
}

/**
 * Creates a React element for a warning message
 *
 * @param props The properties.
 *
 * @returns {ReactElement} The formatted warning message.
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
