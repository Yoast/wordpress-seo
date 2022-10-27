<?php
namespace Yoast\WP\SEO\Schema\Domain;

use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Schema\Domain\Search_Term;

/**
 * Generates the SearchAction schema Piece
 */
class Search_Result_Schema_Piece extends Abstract_Schema_Piece {

	/**
	 * The search term domain object.
	 *
	 * @var \Yoast\WP\SEO\Schema\Domain\Search_Term $search_term
	 */
	private $search_term;

	/**
	 * Search_Result_Schema_Piece constructor.
	 *
	 * @param \Yoast\WP\SEO\Schema\Domain\Search_Term $search_term The search term domain object.
	 */
	public function __construct( Search_Term $search_term ) {
		$this->search_term = $search_term;
	}

	/**
	 * Generates the data to be added to the schema graph.
	 *
	 * @return array The data to be added to the schema graph
	 */
	public function generate() {
		$data = [
			'@type'            => 'SearchAction',
			'actionStatus'     => 'https://schema.org/CompletedActionStatus',
			'query'            => $this->search_term->get_query(),
			'result'           => [ '@id' => $this->context->main_schema_id ],
		];

		return $data;
	}

	/**
	 * Returns if the schema graph is needed.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return true;
	}
}
