<?php

namespace Yoast\WP\SEO\Integrations;

/**
 * An interface for indexing integrations.
 */
interface Indexing_Interface {

	/**
	 * Retrieves the amount of unindexed items
	 *
	 * @return int The total amount.
	 */
	public function get_total_unindexed();

	/**
	 * Retrieves the endpoints to call.
	 *
	 * @return array The endpoints.
	 */
	public function get_endpoints();
}
