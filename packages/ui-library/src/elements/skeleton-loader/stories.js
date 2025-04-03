import React from "react";
import SkeletonLoader from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { circular, color, component, fontSize, profile, size } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Some content to determine the size",
	},
};

export const Profile = {
	render: ( args ) => (
		<div className="yst-w-full yst-max-w-sm yst-p-4 yst-border yst-bg-white yst-rounded-md yst-shadow">
			<div className="yst-flex yst-space-x-4 rtl:yst-space-x-reverse">
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
	),
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: profile,
			},
		},
	},
};

export const Circular = {
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: circular,
			},
		},
	},
	args: {
		className: "yst-h-10 yst-w-10 yst-rounded-full",
	},
};

export const Size = {
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: size,
			},
		},
	},
	args: {
		className: "yst-h-8 yst-w-96",
	},
};

export const Color = {
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: color,
			},
		},
	},
	args: {
		className: "yst-bg-blue-200",
		children: "Some content",
	},
};

export const FontSize = {
	name: "Font size",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: fontSize,
			},
		},
	},
	args: {
		className: "yst-text-3xl",
		children: "Some other content",
	},
};

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
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ Profile, Circular, Size, Color, FontSize ] } />,
		},
	},
};
