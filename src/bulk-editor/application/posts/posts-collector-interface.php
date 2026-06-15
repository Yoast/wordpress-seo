<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;

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
	 * Collects a page of posts for the given content type.
	 *
	 * @param string $content_type The content type to collect posts for.
	 * @param int    $per_page     The number of posts to collect.
	 *
	 * @return Posts_List The collected posts.
	 */
	public function get_posts( string $content_type, int $per_page ): Posts_List;
}
