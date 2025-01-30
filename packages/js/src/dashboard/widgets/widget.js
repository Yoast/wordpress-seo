import { Paper, Title } from "@yoast/ui-library";

const WidgetTitle = ( { children, ...props } ) => (
	<Title as="h2" { ...props }>
		{ children }
	</Title>
);
WidgetTitle.displayName = "Widget.Title";

/**
 * @param {string} [title] The title in an H2.
 * @param {JSX.Element} children The content.
 * @returns {JSX.Element} The element.
 */
export const Widget = ( { title, children } ) => {
	return (
		<Paper className="yst-grow yst-p-8 yst-shadow-md yst-mt-6">
			{ title && <WidgetTitle>{ title }</WidgetTitle> }
			{ children }
		</Paper>
	);
};

Widget.Title = WidgetTitle;
