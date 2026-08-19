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
	 * The fields the "needs improvement" filter can target, as sent by the client.
	 *
	 * @var array<string>
	 */
	public const NEEDS_IMPROVEMENT_FIELDS = [ 'seo_title', 'meta_description', 'social_title', 'social_description' ];

	/**
	 * The inclusive lower bound of the per-field score range that counts as "needs improvement".
	 *
	 * The bad + ok score groups are 1-70; 0 (and a missing/NULL value) means "never scored" and is deliberately
	 * outside the range, so unscored posts only match through the empty check.
	 *
	 * @var int
	 */
	public const NEEDS_IMPROVEMENT_MIN_SCORE = 1;

	/**
	 * The inclusive upper bound of the per-field score range that counts as "needs improvement".
	 *
	 * @var int
	 */
	public const NEEDS_IMPROVEMENT_MAX_SCORE = 70;

	/**
	 * Collects a page of posts for the given query.
	 *
	 * @param Posts_Query $query The query describing the page to collect.
	 *
	 * @return Posts_Page The collected posts together with the totals for pagination.
	 */
	public function get_posts( Posts_Query $query ): Posts_Page;
}
