import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import recurseOverBlocks from "./blocks/recurseOverBlocks";

export function getInnerblocksOfType ( needles : string[], haystack: BlockInstance[] ) : BlockInstance[] {
    var foundBlocks : BlockInstance[];
            
    recurseOverBlocks ( haystack, ( block : BlockInstance ) => {
        // check if the current block is one of the required types
        if ( needles.includes( block.name )) {
            foundBlocks.push ( block );
        }
    });
    return foundBlocks;
}

// Get the current block from the core/block-editor store
export function getInnerBlocks( clientId : string ) : BlockInstance[] {
    return select( "core/block-editor" ).getBlock( clientId ).innerBlocks;
}