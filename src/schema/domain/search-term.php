<?php
namespace Yoast\WP\SEO\Schema\Domain;

/**
 * The search term domain object.
 */
class Search_Term {

	/**
	 * The search query.
	 *
	 * @var string $query
	 */
	private $query;

	/**
	 * Search Term constructor.
	 *
	 * @param string $query The query.
	 */
	public function __construct( $query ) {
		$this->query = $query;
	}

	/**
	 * Return the search query.
	 *
	 * @return string The search query.
	 */
	public function get_query() {
		return $this->query;
	}
}
