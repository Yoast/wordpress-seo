<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Plugins_Tab\User_Interface;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Plugins_Tab\Application\Plugins_List_Handler;

/**
 * Registers the Yoast tab on the WordPress Plugins screen.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Plugins_Tab_Integration implements Integration_Interface {

	/**
	 * The plugins list handler.
	 *
	 * @var Plugins_List_Handler
	 */
	private $handler;

	/**
	 * Constructs the integration.
	 *
	 * @param Plugins_List_Handler $handler The plugins list handler.
	 */
	public function __construct( Plugins_List_Handler $handler ) {
		$this->handler = $handler;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals(): array {
		return [
			Admin_Conditional::class,
		];
	}

	/**
	 * Registers the hooks for the Yoast plugins tab.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		global $wp_version;

		if ( \version_compare( $wp_version, '7.0-alpha0', '<' ) ) {
			return;
		}

		\add_filter( 'plugins_list', [ $this->handler, 'filter_plugins_list' ] );
		\add_filter( 'plugins_list_status_text', [ $this->handler, 'get_status_text' ], 10, 3 );
	}
}
