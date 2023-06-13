import Skeleton from ".";

export default {
	title: "1) Elements/Skeleton",
	component: Skeleton,
	argTypes: {
		children: { control: "text" },
		as: {
			control: { type: "select" },
			options: [ "span", "div" ],
		},
	},
	parameters: {
		docs: {
			description: {
				component: "The Skeleton component is there to indicate something is loading.",
			},
		},
	},
};

const Template = ( args ) => <Skeleton { ...args } />;

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Some content to determine the size",
};

export const Profile = ( args ) => (
	<div { ...args } className="yst-w-full yst-max-w-sm yst-p-4 yst-border yst-rounded-md yst-shadow">
		<div className="yst-flex yst-space-x-4">
			<Skeleton className="yst-h-10 yst-w-10 yst-rounded-full" />
			<div className="yst-flex-1 yst-space-y-6 yst-py-1">
				<Skeleton className="yst-h-3 yst-w-full" />
				<div className="yst-space-y-3">
					<div className="yst-grid yst-grid-cols-3 yst-gap-4">
						<Skeleton className="yst-h-3 yst-w-full yst-col-span-2" />
						<Skeleton className="yst-h-3 yst-w-full yst-col-span-1" />
					</div>
					<Skeleton className="yst-h-3 yst-w-full" />
				</div>
			</div>
		</div>
	</div>
);
Profile.parameters = {
	docs: {
		description: {
			story: "You need to create your own layout for more complicated structures.",
		},
	},
};

export const Circular = Template.bind( {} );
Circular.parameters = {
	docs: {
		description: {
			story: "By specifying a className that changes the border radius. Be sure to have the width and height the same, or it is not much of a circle.",
		},
	},
};
Circular.args = {
	className: "yst-h-10 yst-w-10 yst-rounded-full",
};

export const Size = Template.bind( {} );
Size.parameters = {
	docs: {
		description: {
			story: "By specifying a className that changes the width and/or height.",
		},
	},
};
Size.args = {
	className: "yst-h-8 yst-w-96",
};

export const Color = Template.bind( {} );
Color.parameters = {
	docs: {
		description: {
			story: "By specifying a className that changes the background color. Be sure the color is light enough for the effect.",
		},
	},
};
Color.args = {
	className: "yst-bg-blue-200",
	children: "Some content",
};

export const FontSize = Template.bind( {} );
FontSize.storyName = "Font size";
FontSize.parameters = {
	docs: {
		description: {
			story: "By specifying a className that changes the font size. Be sure to include some text in the children too.",
		},
	},
};
FontSize.args = {
	className: "yst-text-3xl",
	children: "Some other content",
};
