<?php
namespace Yoast\WP\SEO\Schema\Domain;

class Search_Term {
	private $query;

	/**
	 * @param string $query The query.
	 */
	public function __construct( $query ) {
		$this->query = $query;
	}

	public function get_query() {
		return $this->query;
	}
}