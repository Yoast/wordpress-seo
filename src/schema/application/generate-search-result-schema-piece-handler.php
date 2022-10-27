<?php
namespace Yoast\WP\SEO\Schema\Application;

use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece;
use Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece;

class Generate_Search_Result_Schema_Piece_Handler {

	public function __invoke( Generate_Search_Result_Schema_Piece $command ) {
		 return new Search_Result_Schema_Piece( $command->get_search_term() );
	}

}
