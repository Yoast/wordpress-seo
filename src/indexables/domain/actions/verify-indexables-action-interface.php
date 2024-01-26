<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Domain\Actions;

use wpdb;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;

/**
 * The Verify_Indexables_Action_Interface interface.
 */
interface Verify_Indexables_Action_Interface {

	/**
	 * Rebuilds indexables for the given action type.
	 *
	 * @param Last_Batch_Count $last_batch_count The last batch count domain object.
	 * @param Batch_Size       $batch_size       The batch size domain object.
	 *
	 * @return bool return false if there are no objects left to re-build.
	 */
	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size ): bool;

	/**
	 * Sets the wpdb instance.
	 *
	 * @param wpdb $wpdb The wpdb instance.
	 *
	 * @return void
	 * @required
	 */
	public function set_wpdb( wpdb $wpdb );
}
