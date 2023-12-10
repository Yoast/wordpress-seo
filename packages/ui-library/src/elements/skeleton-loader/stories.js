import React from "react";
import SkeletonLoader from ".";
import { circular, color, component, fontSize, profile, size } from "./docs";

export default {
	title: "1) Elements/Skeleton loader",
	component: SkeletonLoader,
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
				component,
			},
		},
	},
};

const Template = ( args ) => <SkeletonLoader { ...args } />;

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Some content to determine the size",
};

export const Profile = ( args ) => (
	<div { ...args } className="yst-w-full yst-max-w-sm yst-p-4 yst-border yst-bg-white yst-rounded-md yst-shadow">
		<div className="yst-flex yst-space-x-4">
			<SkeletonLoader className="yst-h-10 yst-w-10 yst-rounded-full" />
			<div className="yst-flex-1 yst-space-y-6 yst-py-1">
				<SkeletonLoader className="yst-h-3 yst-w-full" />
				<div className="yst-space-y-3">
					<div className="yst-grid yst-grid-cols-3 yst-gap-4">
						<SkeletonLoader className="yst-h-3 yst-w-full yst-col-span-2" />
						<SkeletonLoader className="yst-h-3 yst-w-full yst-col-span-1" />
					</div>
					<SkeletonLoader className="yst-h-3 yst-w-full" />
				</div>
			</div>
		</div>
	</div>
);
Profile.parameters = {
	docs: {
		description: {
			story: profile,
		},
	},
};

export const Circular = Template.bind( {} );
Circular.parameters = {
	docs: {
		description: {
			story: circular,
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
			story: size,
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
			story: color,
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
			story: fontSize,
		},
	},
};
FontSize.args = {
	className: "yst-text-3xl",
	children: "Some other content",
};
