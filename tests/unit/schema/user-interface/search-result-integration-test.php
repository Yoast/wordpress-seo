<?php

namespace Yoast\WP\SEO\Tests\Unit\Schema\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece_Handler;
use Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece;
use Yoast\WP\SEO\Schema\Domain\Search_Term;
use Yoast\WP\SEO\Schema\User_Interface\Search_Result_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Search_Result_Integration_Test.
 *
 * @group schema
 * @group search-result-schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\User_Interface\Search_Result_Integration
 */
class Search_Result_Integration_Test extends TestCase {

	/**
	 * Represents the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Represents the search piece handler.
	 *
	 * @var Mockery\MockInterface|Generate_Search_Result_Schema_Piece_Handler
	 */
	private $search_piece_handler;

	/**
	 * The subject of testing.
	 *
	 * @var Search_Result_Integration $instance
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->current_page_helper  = Mockery::mock( Current_Page_Helper::class );
		$this->search_piece_handler = Mockery::mock( Generate_Search_Result_Schema_Piece_Handler::class );

		$this->instance = new Search_Result_Integration( $this->current_page_helper, $this->search_piece_handler );
	}

	/**
	 * Tests the register hooks function.
	 *
	 * @covers ::register_hooks
	 * @return void
	 */
	public function test_register_hooks(): void {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			\has_filter(
				'wpseo_schema_graph_pieces',
				[
					$this->instance,
					'add_search_result_schema_piece',
				]
			)
		);
	}

	/**
	 * Tests the get conditionals function.
	 *
	 * @covers ::get_conditionals
	 * @return void
	 */
	public function test_get_conditionals(): void {
		$this->assertSame( [ Front_End_Conditional::class ], Search_Result_Integration::get_conditionals() );
	}

	/**
	 * Tests the add_search_result_schema_piece function.
	 *
	 * @covers ::add_search_result_schema_piece
	 *
	 * @return void
	 */
	public function test_add_search_result_schema_piece(): void {
		$this->current_page_helper->expects( 'is_search_result' )->andReturnTrue();
		$this->search_piece_handler->expects( 'handle' )->andReturn( new Search_Result_Schema_Piece( new Search_Term( 'the_query' ) ) );

		Monkey\Functions\expect( 'get_search_query' )
			->once()
			->andReturn( 'the_query' );
		$result = $this->instance->add_search_result_schema_piece( [], [] );


		$this->assertInstanceOf( Search_Result_Schema_Piece::class, $result[0] );
	}

	/**
	 * Tests the add_search_result_schema_piece function.
	 *
	 * @covers ::add_search_result_schema_piece
	 *
	 * @return void
	 */
	public function test_add_search_result_schema_piece_not_search_page(): void {
		$this->current_page_helper->expects( 'is_search_result' )->andReturnFalse();
		$this->search_piece_handler->expects( 'handle' )->never();

		Monkey\Functions\expect( 'get_search_query' )->never();
		$this->instance->add_search_result_schema_piece( [], [] );
	}
}
