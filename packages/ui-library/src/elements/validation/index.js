import PropTypes from "prop-types";

export { default as ValidationIcon } from "./validation-icon";
export { default as ValidationInput } from "./validation-input";
export { default as ValidationMessage } from "./validation-message";

export const validationPropType = PropTypes.shape( {
	variant: PropTypes.string,
	message: PropTypes.node,
} );
