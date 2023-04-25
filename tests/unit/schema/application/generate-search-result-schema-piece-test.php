<?php

namespace Yoast\WP\SEO\Tests\Unit\Schema\Application;

use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Generate_Search_Result_Schema_Piece_Test.
 *
 * @group schema
 * @group search-result-schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece
 */
class Generate_Search_Result_Schema_Piece_Test extends TestCase {

	/**
	 * Tests if the passed variable ends up as the search term.
	 *
	 * @covers ::get_search_term
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_search_term(): void {
		$instance = new Generate_Search_Result_Schema_Piece( 'My search term.' );
		$this->assertSame( 'My search term.', $instance->get_search_term()->get_query() );
	}
}
