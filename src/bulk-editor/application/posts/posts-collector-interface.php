<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;

/**
 * Describes a collector that gathers a page of posts for the bulk editor.
 */
interface Posts_Collector_Interface {

	/**
	 * The post statuses shown in the bulk editor.
	 *
	 * @var array<string>
	 */
	public const STATUSES = [ 'publish', 'draft', 'pending', 'future' ];

	/**
	 * Collects a page of posts for the given query.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return Posts_Page The collected posts together with the totals for pagination.
	 */
	public function get_posts( Posts_Query $query ): Posts_Page;
}
