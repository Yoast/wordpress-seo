<?php
namespace Yoast\WP\SEO\Schema\Application;

use Yoast\WP\SEO\Schema\Domain\Search_Term;

class Generate_Search_Result_Schema_Piece {

	private $search_term;
	/**
	 * @param string $query The query.
	 */
	public function __construct( $search_term ) {
		$this->search_term = new Search_Term( $search_term );
	}

	public function get_search_term() {
		return $this->search_term;
	}

}
