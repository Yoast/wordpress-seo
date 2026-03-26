<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Plugins_Tab\Domain;

/**
 * Detects whether a plugin is a Yoast plugin by checking its author information.
 */
class Plugin_Detector {

	/**
	 * The string to look for in the plugin's AuthorName field.
	 *
	 * @var string
	 */
	public const AUTHOR_IDENTIFIER = 'Team Yoast';

	/**
	 * The minimum number of Yoast plugins required to show the tab.
	 *
	 * @var int
	 */
	public const MINIMUM_FOR_TAB = 2;

	/**
	 * Checks whether a plugin is a Yoast plugin based on its author data.
	 *
	 * @param array<string, string> $plugin_data The plugin data array.
	 *
	 * @return bool Whether the plugin is a Yoast plugin.
	 */
	public function is_yoast_plugin( array $plugin_data ): bool {
		if ( ! isset( $plugin_data['AuthorName'] ) || ! \is_string( $plugin_data['AuthorName'] ) ) {
			return false;
		}

		return \str_contains( $plugin_data['AuthorName'], self::AUTHOR_IDENTIFIER );
	}
}
