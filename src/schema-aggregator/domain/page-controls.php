<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Class to contain page controls.
 */
class Page_Controls {

	/**
	 * The page.
	 *
	 * @var int
	 */
	private $page;

	/**
	 * The page size.
	 *
	 * @var int
	 */
	private $page_size;

	/**
	 * The post type.
	 *
	 * @var string
	 */
	private $post_type;

	/**
	 * The constructor.
	 *
	 * @param int    $page      The current page.
	 * @param int    $page_size The page size.
	 * @param string $post_type The post type.
	 */
	public function __construct( int $page, int $page_size, string $post_type ) {
		$this->page      = $page;
		$this->page_size = $page_size;
		$this->post_type = $post_type;
	}

	/**
	 * Gets the current page.
	 *
	 * @return int
	 */
	public function get_page(): int {
		return $this->page;
	}

	/**
	 * Gets the page size.
	 *
	 * @return int
	 */
	public function get_page_size(): int {
		return $this->page_size;
	}

	/**
	 * Gets the post type.
	 *
	 * @return string
	 */
	public function get_post_type(): string {
		return $this->post_type;
	}
}
