<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * This class holds the rule for how many updates a single batch may contain.
 */
class Batch_Limit {

	/**
	 * The maximum number of updates in a single batch.
	 */
	public const MAX_ITEMS = 20;

	/**
	 * Whether the given number of updates is within the batch limit.
	 *
	 * @param int $count The number of updates in the batch.
	 *
	 * @return bool Whether the given number of updates is within the batch limit.
	 */
	public static function is_within_limit( int $count ): bool {
		return $count <= self::MAX_ITEMS;
	}
}
