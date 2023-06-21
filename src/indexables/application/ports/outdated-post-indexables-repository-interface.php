<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Application\Ports;

use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List;
use Yoast\WP\SEO\Indexables\Domain\Plugin_Deactivated_Timestamp;

interface Outdated_Post_Indexables_Repository_Interface {

	/**
	 * Finds a list of posts for which the indexables are not up to date.
	 * This is done by checking if the updated at of the post is the same as the indexable.
	 *
	 * @param Last_Batch_Count $count The batch count domain object.
	 *
	 * @throws No_Outdated_Posts_Found_Exception When there are no outdated posts found.
	 * @return Outdated_Post_Indexables_List
	 */
	public function get_outdated_post_indexables(
		Last_Batch_Count $count
	): Outdated_Post_Indexables_List;
}
