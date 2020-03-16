import React from "react";
import { TextInput } from "@yoast/components/src/inputs/Input";

const ReactifiedComponentsWrapper = () => {
	return (
		<div>
			<TextInput
				label="This is the input label"
				value="This is the input value"
				type="text"
			/>
			<TextInput
				label="This input has a description"
				description="Great description!"
				type="text"
				placeholder="The best placeholder ev4h"
			/>
		</div>
	);
};
export default ReactifiedComponentsWrapper;
