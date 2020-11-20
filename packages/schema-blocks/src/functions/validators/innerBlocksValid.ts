import { BlockInstance } from "@wordpress/blocks";
import { countBy } from "lodash";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { RequiredBlockOption, InvalidBlockReason } from "../../instructions/blocks/enums";
import { RequiredBlock, InvalidBlock } from "../../instructions/blocks/dto";
import { getInnerBlocks, getInnerblocksOfType } from "../innerBlocksHelper";

function findMissingBlocks( requiredBlockKeys: string[], existingRequiredBlocks: BlockInstance[] ) : InvalidBlock[] {
    let invalidBlocks : InvalidBlock[];
    const missingRequiredBlocks = requiredBlockKeys.filter( requiredblockname => {
        // Every block in the found blocks collection does not match the requiredblock, i.e. we haven't found the requiredblock.
        existingRequiredBlocks.every( block => block.name !== requiredblockname );
    });

    // These blocks should've been in here somewhere, but they're not.
    missingRequiredBlocks.forEach( missingBlockName => {
        invalidBlocks.push( createInvalidBlock( missingBlockName, InvalidBlockReason.Missing ));
    });

    return invalidBlocks;
}

function findRedundantBlocks( requiredBlocks: RequiredBlock[], existingRequiredBlocks: BlockInstance[] ) : InvalidBlock[] {
    let onlyOneAllowed: string[];
    let invalidBlocks : InvalidBlock[];

    requiredBlocks
        .filter( block => { block.option === RequiredBlockOption.One; })
        .forEach( block => { onlyOneAllowed.push( block.type ); });
    if ( onlyOneAllowed ) {
        // Count the occurrences of each block so we can find all keys that have too many occurrences.
        let countPerBlockType = countBy( existingRequiredBlocks, block => block.name );
        for ( let blockName in countPerBlockType ) {
            if ( countPerBlockType[ blockName ] > 1 ) {
                invalidBlocks.push( createInvalidBlock ( blockName, InvalidBlockReason.TooMany ));
            }
        }
    }
    return invalidBlocks;
}

function findSelfInvalidatedBlocks( innerBlocks : BlockInstance[] ) : InvalidBlock[] {
    let invalidBlocks : InvalidBlock[];
    innerBlocks.forEach( block => {
        if ( !block.isValid ){
            invalidBlocks.push( createInvalidBlock ( block.name, InvalidBlockReason.Internal ));
        }
    });
    return invalidBlocks;
}

function getInvalidInnerBlocks( requiredBlocks : RequiredBlock[], props: RenderEditProps | RenderSaveProps ) : InvalidBlock[]  {
    let invalidBlocks: InvalidBlock[];

    const innerBlocks = getInnerBlocks( props.clientId );
    const requiredBlockKeys = Object.keys( requiredBlocks );

    // Find all instances of required block types.
    const existingRequiredBlocks = getInnerblocksOfType( requiredBlockKeys, innerBlocks );

    // Find all block types that do not occur in existingBlocks.
    invalidBlocks.push( ...findMissingBlocks( requiredBlockKeys, existingRequiredBlocks ));

    // Find all block types that allow only one occurrence.
    invalidBlocks.push( ...findRedundantBlocks( requiredBlocks, existingRequiredBlocks ));

    // Find all blocks that have decided for themselves that they're invalid
    invalidBlocks.push( ...findSelfInvalidatedBlocks( innerBlocks ));

    return invalidBlocks;
}

function createInvalidBlock( type : string, reason : InvalidBlockReason ) {
    return {
        type,
        reason,
    } as InvalidBlock;
}

export default getInvalidInnerBlocks;
export { findMissingBlocks, findRedundantBlocks, findSelfInvalidatedBlocks, createInvalidBlock };
