import { ReactElement } from "react";
import { useSelect } from "@wordpress/data";
import { createElement, Fragment, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import { TextControl } from "@wordpress/components";

import BlockSuggestions from "./BlockSuggestionsPresenter";
import { createAnalysisMessages, SidebarWarning } from "./SidebarWarningPresenter";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";
import { BlockValidationResult } from "../../core/validation";
import logger from "../logger";
import LabelWithHelpLink from "./LabelWithHelpLinkPresenter";

interface SchemaAnalysisProps {
	recommendedBlocks: string[];
	requiredBlocks: string[];
}

/**
 * Retrieves the validation results from the Redux store.
 *
 * @returns The validation results.
 */
function useValidationResults(): BlockValidationResult[] {
	return useSelect( select => {
		const allBlockNames = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getBlockNames();
		return select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getValidationsForBlockNames( allBlockNames );
	}, [] );
}

/**
 * The schema analysis component.
 *
 * @param props The properties.
 *
 * @returns The schema analysis component.
 *
 * @constructor
 */
export function SchemaAnalysis( props: SchemaAnalysisProps ): ReactElement {
	const validationResults = useValidationResults();

	let warnings: SidebarWarning[] = [];

	if ( validationResults ) {
		warnings = createAnalysisMessages( validationResults );
		logger.debug( "Warnings:", warnings );
	}

	const [ jobTitle, setJobTitle ] = useState( "" );

	/**
	 * Changes the job title.
	 *
	 * @param text The new job title.
	 */
	const onChange = ( text: string ) => {
		setJobTitle( text );
	};

	return <div key={ "schema-analysis" } className={ "yoast-schema-analysis" }>
		<LabelWithHelpLink
			text={ __( "Job Posting schema", "yoast-schema-blocks" ) }
			URL={ "https://yoa.st/4dk" }
		/>
		<TextControl onChange={ onChange } value={ jobTitle } label={ "Job title" } />
		<WarningList warnings={ warnings } />
		<BlockSuggestions
			heading={ __( "Required information", "yoast-schema-blocks" ) }
			blockNames={ props.requiredBlocks }
		/>
		<BlockSuggestions
			heading={ __( "Recommended information", "yoast-schema-blocks" ) }
			blockNames={ props.recommendedBlocks }
		/>
	</div>;
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
