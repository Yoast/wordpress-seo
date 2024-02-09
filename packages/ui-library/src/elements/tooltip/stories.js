import { StoryComponent } from ".";
import { component } from "./docs";
import { useState } from "@wordpress/element";
import Badge from "../badge";

export default {
	title: "1) Elements/Tooltip",
	component: StoryComponent,
	argTypes: {
		as: { options: [ "div", "span" ] },
	},
	parameters: { docs: { description: { component } } },
};

export const Factory = ( args ) => {
	const [ isVisible, setIsVisible ] = useState( false );

	return (
		<div className="yst-my-12">
			<Badge
				as="button"
				variant="plain"
				onMouseEnter={ () => setIsVisible( true ) }
				onMouseLeave={ () => setIsVisible( false ) }
				className="yst-relative yst-flex yst-self-center yst-justify-center"
			> Hover me
				<StoryComponent { ...args } isVisible={ isVisible } />
			</Badge>
		</div>
	);
};

Factory.parameters = {
	controls: { disable: false },
};

Factory.args = {
	children: "I'm a tooltip",
};
