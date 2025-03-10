import { Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";
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
 * @param {ReactNode} children The content of the paragraph.
 * @param {Object[]} [dataSources] The sources of the data in the widget.
 * @returns {JSX.Element} The widget tooltip with paragraph and optional learn more link.
 */
export const WidgetTooltip = ( { children, dataSources } ) => (
	<InfoTooltip>
		<p className="yst-mb-2 yst-text-slate-600">{ children }</p>
		{
			dataSources && dataSources.length > 0 && (
				<div className="yst-pb-2 yst-border-t yst-mt-3 yst-border-slate-200 yst-italic yst-text-[11px]">
					<span className="yst-block yst-mt-4 yst-mb-4 yst-font-semibold yst-text-slate-800">{ __( "Data provided by:", "wordpress-seo" ) }</span>
					<ul>
						{ dataSources.map( ( dataSource, index ) => (
							<li className="yst-gap-2 yst-flex yst-mt-4 yst-text-slate-500" key={ index }>
								{ dataSource.feature && (
									<div>
										<strong className="yst-font-semibold">{ dataSource.source } - </strong> { dataSource.feature }
									</div>
								) }
								{ ! dataSource.feature && (
									<div>
										<strong className="yst-font-semibold">{ dataSource.source } </strong>
									</div>
								) }

							</li>
						) ) }
					</ul>
				</div>
			)
		}
	</InfoTooltip>
);
WidgetTooltip.displayName = "Widget.Tooltip";

/**
 * @param {string} [className] The class name.
 * @param {string} [title] The title in an H2.
 * @param {string} [tooltip] The description in a tooltip of an info button.
 * @param {string[]} [dataSources] The sources of the data in the widget.
 * @param {ReactNode} children The content.
 * @returns {JSX.Element} The widget.
 */
export const Widget = ( { className = "yst-paper__content", title, tooltip, dataSources, children } ) => (
	<Paper className={ classNames( "yst-shadow-md", className ) }>
		{ ( title || tooltip ) && <div className="yst-flex yst-justify-between">
			{ title && <WidgetTitle>{ title }</WidgetTitle> }
			{ tooltip && <WidgetTooltip dataSources={ dataSources }>{ tooltip }</WidgetTooltip> }
		</div> }
		{ children }
	</Paper>
);
