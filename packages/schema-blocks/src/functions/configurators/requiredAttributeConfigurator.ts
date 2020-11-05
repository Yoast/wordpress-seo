import { BlockConfiguration } from "@wordpress/blocks";

function requiredAttribute( name : string, attributeType : string) : Partial<BlockConfiguration> {
    return {
        attributes: {
            [ name ]: {
                type: attributeType,
                required: true, // This also tells Gutenberg that the attribute is or isn't required.
            },
        },
    };
}

export default requiredAttribute;