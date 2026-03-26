<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Yoast_Plugins_Tab\Application;

use Yoast\WP\SEO\Yoast_Plugins_Tab\Domain\Yoast_Plugin_Detector;

/**
 * Handles the filtering logic for the Yoast plugins tab on the Plugins screen.
 */
class Yoast_Plugins_List_Handler {

	/**
	 * The Yoast plugin detector.
	 *
	 * @var Yoast_Plugin_Detector
	 */
	private $detector;

	/**
	 * Constructs the handler.
	 *
	 * @param Yoast_Plugin_Detector $detector The Yoast plugin detector.
	 */
	public function __construct( Yoast_Plugin_Detector $detector ) {
		$this->detector = $detector;
	}

	/**
	 * Filters the plugins list to add a 'yoast' group when 2+ Yoast plugins are installed.
	 *
	 * @param array<string, array<string, array<string, string>>> $plugins The plugins list keyed by status.
	 *
	 * @return array<string, array<string, array<string, string>>> The filtered plugins list.
	 */
	public function filter_plugins_list( array $plugins ): array {
		if ( ! isset( $plugins['all'] ) ) {
			return $plugins;
		}

		$yoast_plugins = [];
		foreach ( $plugins['all'] as $plugin_file => $plugin_data ) {
			if ( $this->detector->is_yoast_plugin( $plugin_data ) ) {
				$yoast_plugins[ $plugin_file ] = $plugin_data;
			}
		}

		if ( \count( $yoast_plugins ) < Yoast_Plugin_Detector::MINIMUM_FOR_TAB ) {
			return $plugins;
		}

		$plugins['yoast'] = $yoast_plugins;

		return $plugins;
	}

	/**
	 * Returns the status text for the Yoast plugins tab.
	 *
	 * @param string $text  The current status text.
	 * @param int    $count The number of plugins with this status.
	 * @param string $type  The status type slug.
	 *
	 * @return string The status text.
	 */
	public function get_status_text( string $text, int $count, string $type ): string {
		if ( $type !== 'yoast' ) {
			return $text;
		}

		return \_nx( 'Yoast', 'Yoast', $count, 'plugin status', 'wordpress-seo' );
	}
}
