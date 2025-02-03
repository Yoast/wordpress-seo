import { Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";

const WidgetTitle = ( { children, ...props } ) => (
	<Title as="h2" { ...props }>
		{ children }
	</Title>
);
WidgetTitle.displayName = "Widget.Title";

/**
 * @param {string} [className] The class name.
 * @param {string} [title] The title in an H2.
 * @param {JSX.Element} children The content.
 * @returns {JSX.Element} The element.
 */
export const Widget = ( { className = "yst-paper__content", title, children } ) => {
	return (
		<Paper className={ classNames( "yst-shadow-md", className ) }>
			{ title && <WidgetTitle>{ title }</WidgetTitle> }
			{ children }
		</Paper>
	);
};

Widget.Title = WidgetTitle;
