import { BlockConfiguration } from "@wordpress/blocks";

function simpleAttribute( name : string, attributeType : string) : Partial<BlockConfiguration> {
    return {
        attributes: {
            [ name ]: {
                type: attributeType,
            },
        },
    };
}

export default simpleAttribute;