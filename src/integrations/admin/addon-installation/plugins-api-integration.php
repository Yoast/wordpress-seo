<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Discussed in Tech Council, a better solution is being worked on.

namespace Yoast\WP\SEO\Integrations\Admin\Addon_Installation;

use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

class Plugins_API_Integration implements Integration_Interface {

	/**
	 * The addon manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Addon_Installation constructor.
	 *
	 * @param WPSEO_Addon_Manager $addon_manager The addon manager.
	 */
	public function __construct( WPSEO_Addon_Manager $addon_manager ) {
		$this->addon_manager = $addon_manager;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_filter( 'install_plugins_tabs', [ $this, 'add_tab' ] );
		\add_filter( 'install_plugins_table_api_args_yoast', [ $this, 'return_yoast_tab_args' ] );
		\add_filter( 'plugins_api', [ $this, 'maybe_add_api_result' ], 10, 3 );
		\add_action( 'install_plugins_yoast', 'display_plugins_table' );
	}

	/**
	 * Adds the Yoast tab to the plugin tabs.
	 *
	 * @param array $tabs The tabs.
	 *
	 * @return array The tabs with the Yoast tab added.
	 */
	public function add_tab( $tabs ) {
		$tabs['yoast'] = __( 'Yoast', 'wordpress-seo' );
		return $tabs;
	}

	/**
	 * Adds the Yoast tab arguments.
	 *
	 * @return array The Yoast tab arguments.
	 */
	public function return_yoast_tab_args() {
		return [ 'browse' => 'yoast' ];
	}

	/**
	 * Adds the Yoast API result if on the Yoast tab.
	 *
	 * @param object $res    The response.
	 * @param string $action The action.
	 * @param object $args   The arguments.
	 *
	 * @return object The modified response.
	 */
	public function maybe_add_api_result( $res, $action, $args ) {
		if ( $action !== 'query_plugins' || $args->browse !== 'yoast' ) {
			return $res;
		}

		// For the data in the Yoast tab to display correctly WordPress needs updated plugin information.
		\wp_update_plugins();

		$installed = $this->addon_manager->get_installed_addons_plugin_files();
		$plugins   = $this->addon_manager->get_plugins_information();
		$plugins   = \array_map(
			function ( $plugin ) use ( $installed ) {
				// if ( isset( $installed[ $plugin->slug ] ) ) {
				// list( $directory ) = \explode( \DIRECTORY_SEPARATOR, $installed[ $plugin->slug ] );
				// $plugin->slug      = $directory;
				// }
				$plugin->version      = $plugin->new_version;
				$plugin->last_updated = $plugin->last_update;
				unset( $plugin->new_version );
				unset( $plugin->last_update );
				$plugin->author         = '<a href="https://yoast.com">Team Yoast</a>';
				$plugin->author_profile = 'https://yoast.com/';
				return (array) $plugin;
			},
			$plugins
		);
		return (object) [
			'info'    => [
				'page'    => 1,
				'pages'   => 1,
				'results' => \count( $plugins ),
			],
			'plugins' => $plugins,
		];
	}
}
