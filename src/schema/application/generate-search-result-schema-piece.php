<?php
namespace Yoast\WP\SEO\Schema\Application;

use Yoast\WP\SEO\Schema\Domain\Search_Term;

/**
 * The action for search result schema
 */
class Generate_Search_Result_Schema_Piece {

	/**
	 * The search term domain object.
	 *
	 * @var Search_Term $search_term The search term domain object.
	 */
	private $search_term;

	/**
	 * The search term.
	 *
	 * @param string $search_term The search term.
	 */
	public function __construct( $search_term ) {
		$this->search_term = new Search_Term( $search_term );
	}

	/**
	 * Gets the search term domain object.
	 *
	 * @return Search_Term
	 */
	public function get_search_term() {
		return $this->search_term;
	}
}
