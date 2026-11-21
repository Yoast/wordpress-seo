<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Posts;

/**
 * Describes a single page of bulk editor posts together with the totals needed for pagination.
 */
class Posts_Page {

	/**
	 * The posts on this page.
	 *
	 * @var Posts_List
	 */
	private $posts;

	/**
	 * The total number of posts matching the query across all pages.
	 *
	 * @var int
	 */
	private $total;

	/**
	 * The page of results this represents, starting at 1.
	 *
	 * @var int
	 */
	private $page;

	/**
	 * The number of posts per page.
	 *
	 * @var int
	 */
	private $per_page;

	/**
	 * The constructor.
	 *
	 * @param Posts_List $posts    The posts on this page.
	 * @param int        $total    The total number of posts matching the query.
	 * @param int        $page     The page of results this represents, starting at 1.
	 * @param int        $per_page The number of posts per page.
	 */
	public function __construct( Posts_List $posts, int $total, int $page, int $per_page ) {
		$this->posts    = $posts;
		$this->total    = $total;
		$this->page     = $page;
		$this->per_page = $per_page;
	}

	/**
	 * Returns the total number of pages.
	 *
	 * @return int The total number of pages.
	 */
	public function get_total_pages(): int {
		if ( $this->per_page < 1 ) {
			return 0;
		}

		return (int) \ceil( $this->total / $this->per_page );
	}

	/**
	 * Parses the page to the expected key value representation.
	 *
	 * @return array<string, int|array<array<string, int|string>>> The page presented as the expected key value representation.
	 */
	public function to_array(): array {
		return [
			'posts'       => $this->posts->to_array(),
			'total'       => $this->total,
			'total_pages' => $this->get_total_pages(),
			'page'        => $this->page,
			'per_page'    => $this->per_page,
		];
	}
}
