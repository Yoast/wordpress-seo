import { __, sprintf } from "@wordpress/i18n";

export const toolsFeatures = [
	{
		name: "wpseo.enable_task_list",
		id: "card-wpseo-enable_task_list",
		inputId: "input-wpseo-enable_task_list",
		imageSrc: "/images/icon-task-list.svg",
		title: __( "Task list", "wordpress-seo" ),
		description: __( "The task list helps you keep track of important SEO tasks that need your attention.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/seo-task-list",
		learnMoreLinkId: "link-task-list",
		learnMoreLinkAriaLabel: __( "Task list", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_admin_bar_menu",
		id: "card-wpseo-enable_admin_bar_menu",
		inputId: "input-wpseo-enable_admin_bar_menu",
		imageSrc: "/images/icon-admin-bar.svg",
		title: __( "Admin bar menu", "wordpress-seo" ),
		description: sprintf(
			// translators: %1$s expands to Yoast.
			__( "The %1$s icon in the top admin bar provides quick access to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "wordpress-seo" ),
			"Yoast"
		),
		learnMoreUrl: "https://yoa.st/admin-bar-menu",
		learnMoreLinkId: "link-admin-bar",
		learnMoreLinkAriaLabel: __( "Admin bar menu", "wordpress-seo" ),
	},
];
