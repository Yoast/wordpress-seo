<?php

namespace Yoast\WP\SEO\Indexables\Domain\Actions;

use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Models\Indexable;

interface Verify_Indexables_Action_Interface {


	/**
	 * @param Last_Batch_Count $last_batch_count
	 *
	 * @return bool return false if there are no objects left to re-build.
	 */
	public function re_build_indexables( Last_Batch_Count $last_batch_count):bool;

}
