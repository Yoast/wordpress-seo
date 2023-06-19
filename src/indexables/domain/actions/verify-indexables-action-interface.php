<?php

namespace Yoast\WP\SEO\Indexables\Domain\Actions;

use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Models\Indexable;

/**
 * The Verify_Indexables_Action_Interface interface.
 */
interface Verify_Indexables_Action_Interface {

	/**
	 * @param Last_Batch_Count $last_batch_count
	 * @param Batch_Size       $batch_size
	 *
	 * @return bool return false if there are no objects left to re-build.
	 */
	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size):bool;

	/**
	 * @param \wpdb $wpdb The wpdb instance.
	 *
	 * @return mixed
	 * @required
	 */
	public function set_wpdb( \wpdb $wpdb);
}
