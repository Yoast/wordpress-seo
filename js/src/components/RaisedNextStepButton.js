import React from "react";
import RaisedDefaultButton from "./RaisedDefaultButton";
import ArrowForwardIcon from "material-ui/svg-icons/navigation/arrow-forward";

const RaisedNextStepButton = ( props ) => {
	return (
		<RaisedDefaultButton { ...props }
		                     labelPosition="before"
		                     icon={ <ArrowForwardIcon viewBox="0 0 28 28"/> }/>
	);
};

export default RaisedNextStepButton;
