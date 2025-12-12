import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as TaskListIcon } from "../../../../../images/icon-task-list.svg";
import { ReactComponent as AdminBarIcon } from "../../../../../images/icon-admin-bar.svg";

export const toolsFeatures = [
	{
		name: "wpseo.enable_task_list",
		id: "card-wpseo-enable_task_list",
		inputId: "input-wpseo-enable_task_list",
		Icon: TaskListIcon,
		title: __( "Task list", "wordpress-seo" ),
		description: __( "The task list guides you through important SEO tasks and helps you to manage your site’s SEO.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/site-features-task-list",
		learnMoreLinkId: "link-task-list",
		learnMoreLinkAriaLabel: __( "Task list", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_admin_bar_menu",
		id: "card-wpseo-enable_admin_bar_menu",
		inputId: "input-wpseo-enable_admin_bar_menu",
		Icon: AdminBarIcon,
		title: __( "Admin bar menu", "wordpress-seo" ),
		description: sprintf(
			// translators: %1$s expands to Yoast.
			__( "The %1$s icon in the top admin bar provides quick access to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "wordpress-seo" ),
			"Yoast"
		),
		learnMoreUrl: "https://yoa.st/site-features-admin-bar",
		learnMoreLinkId: "link-admin-bar",
		learnMoreLinkAriaLabel: __( "Admin bar menu", "wordpress-seo" ),
	},
];
