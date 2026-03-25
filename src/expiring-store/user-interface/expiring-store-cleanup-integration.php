<?php

namespace Yoast\WP\SEO\Expiring_Store\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Hooks expiring store cleanup into the existing cleanup cron system.
 */
class Expiring_Store_Cleanup_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The expiring store.
	 *
	 * @var Expiring_Store
	 */
	private $expiring_store;

	/**
	 * The constructor.
	 *
	 * @param Expiring_Store $expiring_store The expiring store.
	 */
	public function __construct( Expiring_Store $expiring_store ) {
		$this->expiring_store = $expiring_store;
	}

	/**
	 * Registers action hooks.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_filter( 'wpseo_misc_cleanup_tasks', [ $this, 'add_cleanup_task' ] );
	}

	/**
	 * Adds the expiring store cleanup task to the cleanup integration.
	 *
	 * @param array<string, callable> $tasks Array of cleanup tasks.
	 *
	 * @return array<string, callable> The tasks with the expiring store cleanup task added.
	 */
	public function add_cleanup_task( $tasks ) {
		return \array_merge(
			$tasks,
			[
				'clean_expired_store_entries' => function () {
					return $this->expiring_store->cleanup_expired();
				},
			],
		);
	}
}
