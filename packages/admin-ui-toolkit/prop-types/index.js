import PropTypes from "prop-types";

export const validationErrorPropType = {
	propType: PropTypes.shape( {
		message: PropTypes.string,
		isVisible: PropTypes.bool,
	} ),
	defaultProp: {
		message: "",
		isVisible: false,
	},
};
