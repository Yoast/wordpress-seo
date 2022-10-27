<?php
namespace Yoast\WP\SEO\Schema\Domain;

use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Schema\Domain\Search_Term;

class Search_Result_Schema_Piece extends Abstract_Schema_Piece {

	private $search_term;

	public function __construct( Search_Term $search_term ) {
		$this->search_term = $search_term;
	}
	public function generate() {
		$data   = [
			'@type'            => "SearchAction",
			'actionStatus'     => "https://schema.org/CompletedActionStatus",
			'query'            => $this->search_term->get_query(),
			'result'           => [ '@id' => $this->context->main_schema_id ]
		];

		return $data;
	}

	public function is_needed()
	{
		return true;
	}
}
