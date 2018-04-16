import React from "react";
import RaisedDefaultButton from "./RaisedDefaultButton";
import ArrowForwardIcon from "material-ui/svg-icons/navigation/arrow-forward";

/**
 * Creates a Raised Next Step button with an arrow on the right.
 *
 * @param {Object} props Props passed to this element.
 * @returns {JSX.Element} Rendered RaisedNextStepButton.
 * @constructor
 */
const RaisedNextStepButton = ( props ) => {
	return (
		<RaisedDefaultButton { ...props }
			labelPosition="before"
			icon={ <ArrowForwardIcon viewBox="0 0 28 28"/> }/>
	);
};

export default RaisedNextStepButton;
