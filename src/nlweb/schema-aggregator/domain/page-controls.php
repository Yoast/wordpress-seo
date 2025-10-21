<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Domain;

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
	 * The constructor.
	 *
	 * @param int $page      The current page.
	 * @param int $page_size The page size.
	 */
	public function __construct( int $page, int $page_size ) {
		$this->page      = $page;
		$this->page_size = $page_size;
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
}
