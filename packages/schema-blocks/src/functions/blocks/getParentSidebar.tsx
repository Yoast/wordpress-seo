import { BlockEditProps } from "@wordpress/blocks";
import { createElement, Fragment } from "@wordpress/element";
import { ReactElement } from "react";
import { getBlockDefinition } from "../../core/blocks/BlockDefinitionRepository";
import { getBlockByClientId } from "../BlockHelper";
import { createBlockEditProps, getParentIdOfType } from "../gutenberg/block";
import logger from "../logger";

/**
 * Gets the sidebar from the parent of a blocks.
 *
 * @param props The block props.
 * @param parents The parents to get the sidebar from.
 *
 * @returns The sidebar.
 */
export default function getParentSidebar( props: BlockEditProps<unknown>, parents: string[] ): ReactElement {
	let parentIds: string[] = [];
	if ( parents ) {
		parentIds = getParentIdOfType( props.clientId, parents );
	}

	const elements: ReactElement[] = [];
	if ( parentIds.length > 0 ) {
		parentIds.forEach( parentId => {
			const parentBlock = getBlockByClientId( parentId );
			const parentBlockDefinition = getBlockDefinition( parentBlock.name );
			if ( parentBlockDefinition ) {
				logger.debug( props.clientId + " inherited sidebar from " + parentBlock.name + " definition" );
				const parentProps = createBlockEditProps( parentBlock );
				elements.push( ...parentBlockDefinition.sidebarElements( parentProps ) );
			}
		} );
	}

	return <Fragment>{ ...elements }</Fragment>;
}
