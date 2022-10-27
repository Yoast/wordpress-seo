<?php

namespace Yoast\WP\SEO\Schema\Application;

use Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece;

/**
 * Handles the Generate_Search_Result_Schema_Piece action
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Generate_Search_Result_Schema_Piece_Handler {

	/**
	 * Invokes the generation of the Schema Piece
	 *
	 * @param \Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece $command The command.
	 *
	 * @return \Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece
	 */
	public function handle( Generate_Search_Result_Schema_Piece $command ) {
		return new Search_Result_Schema_Piece( $command->get_search_term() );
	}
}
