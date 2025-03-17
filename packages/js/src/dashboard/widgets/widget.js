import { useCallback } from "@wordpress/element";
import { ErrorBoundary, Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";
import { ErrorAlert } from "../components/error-alert";
import { InfoTooltip } from "../components/info-tooltip";
import { __ } from "@wordpress/i18n";

/**
 * @param {ReactNode} children The content of the title.
 * @param {Object} [props] Any title props.
 * @returns {JSX.Element} The widget title.
 */
export const WidgetTitle = ( { children, ...props } ) => (
	<Title as="h2" { ...props }>
		{ children }
	</Title>
);
WidgetTitle.displayName = "Widget.Title";

/**
 * @param {ReactNode} content The content of the tooltip.
 * @param {ReactNode} children The rest of the tooltip.
 * @returns {JSX.Element} The widget tooltip.
 */
export const WidgetTooltip = ( { content, children } ) => (
	<InfoTooltip>
		<p className="yst-mb-2 yst-text-slate-600">{ content }</p>
		{ children }
	</InfoTooltip>
);
WidgetTooltip.displayName = "Widget.Tooltip";

/**
 * @param {Object[]} [dataSources] The sources of the data in the widget.
 * @returns {JSX.Element} The sources of the data in the widget as a component.
 */
export const WidgetDataSources = ( { dataSources } ) => (
	<div className="yst-border-t yst-mt-3 yst-border-slate-200 yst-italic yst-text-xxs">
		<div className="yst-mt-3 yst-font-semibold yst-text-slate-800">{ __( "Data provided by:", "wordpress-seo" ) }</div>
		<ul>
			{ dataSources.map( ( dataSource, index ) => (
				<li className="yst-text-slate-500" key={ index }>
					{ dataSource.feature
						? <><span className="yst-font-medium">{ dataSource.source } - </span>{ dataSource.feature }</>
						: dataSource.source
					}
				</li>
			) ) }
		</ul>
	</div>
);
WidgetDataSources.displayName = "Widget.DataSources";

/**
 * @param {string} [className] The class name.
 * @param {string} supportLink The support link.
 * @param {ReactNode} children The content to wrap with an error boundary.
 * @returns {JSX.Element}
 */
export const WidgetErrorBoundary = ( { className = "yst-mt-4", supportLink, children } ) => {
	const ErrorBoundaryFallback = useCallback( ( { error } ) => (
		<ErrorAlert error={ error } className={ className } supportLink={ supportLink } />
	), [ className, supportLink ] );

	return (
		<ErrorBoundary FallbackComponent={ ErrorBoundaryFallback }>{ children }</ErrorBoundary>
	);
};
WidgetErrorBoundary.displayName = "Widget.ErrorBoundary";

/**
 * @param {string} [className] The class name.
 * @param {string} [title] The title in an H2.
 * @param {ReactNode} [tooltip] The widget description in a tooltip of an info button.
 * @param {Object[]} [dataSources] The sources of the data in the widget.
 * @param {string} [errorSupportLink] The support link, to show in the error fallback. If not provided, no error boundary is used.
 * @param {ReactNode} children The content.
 * @returns {JSX.Element} The widget.
 */
// eslint-disable-next-line complexity
export const Widget = ( { className = "yst-paper__content", title, tooltip, dataSources, children, errorSupportLink } ) => (
	<Paper className={ classNames( "yst-shadow-md", className ) }>
		{ ( title || tooltip ) && <div className="yst-flex yst-justify-between">
			{ title && <WidgetTitle>{ title }</WidgetTitle> }
			{ tooltip &&
				<WidgetTooltip content={ tooltip }>
					{ dataSources && dataSources.length > 0 && <WidgetDataSources dataSources={ dataSources } /> }
				</WidgetTooltip>
			}
		</div> }
		{ errorSupportLink
			? <WidgetErrorBoundary supportLink={ errorSupportLink }>{ children }</WidgetErrorBoundary>
			: children
		}
	</Paper>
);
