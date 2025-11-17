import { Paper, Title } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * @returns {JSX.Element} The task list page content placeholder.
 */
export const TaskList = () => {
	return <Paper className="yst-mb-6">
		<>
			<Paper.Header>
				<Title>{ __( "Task list", "wordpress-seo" ) }</Title>
				<p className="yst-max-w-screen-sm yst-mt-3 yst-text-tiny">
					{ __( "Stay on top of your SEO progress with this task list. Complete each task to ensure your site is optimized and aligned with best SEO practices.", "wordpress-seo" ) }
				</p>
			</Paper.Header>
			<Paper.Content>
				<div>
					{ __( "Task list content will be displayed here.", "wordpress-seo" ) }
				</div>
			</Paper.Content>
		</>
	</Paper>;
};
