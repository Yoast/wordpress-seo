<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

/**
 * Trait for tasks that are about recent content.
 */
trait Recent_Content_Task_Trait {

	/**
	 * Returns the recency timestamp.
	 *
	 * @return string
	 */
	public function get_recency_timestamp(): string {
		return \gmdate( 'Y-m-d H:i:s', \strtotime( '-2 months' ) );
	}
}
