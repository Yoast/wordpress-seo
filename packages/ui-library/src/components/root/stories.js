import Root from ".";

export default {
	title: "2. Components/Root",
	component: Root,
	parameters: {
		docs: {
			description: {
				component:
                    "The `Root` component provides your React tree with a `RootContext` which contains general options such as `isRtl` to indicate right to left language direction." +
                    "It also provides a `.yst-root` CSS class for scoping our CSS in opiniated environments." +
                    "You can use the `RootContext` by using the `useRootContext` hook exported from `@yoast/ui-library/hooks`.",
			},
		},
	},
};

export const Factory = ( { children, ...args } ) => (
	<Root { ...args }>{ children }</Root>
);
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Start of your React tree",
};
