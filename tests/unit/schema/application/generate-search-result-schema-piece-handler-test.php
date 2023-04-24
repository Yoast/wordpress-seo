<?php

namespace Yoast\WP\SEO\Tests\Unit\Schema\Application;

use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece;
use Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece_Handler;
use Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Generate_Search_Result_Schema_Piece_Handler_Test.
 *
 * @group schema
 * @group search-result-schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\Application\Generate_Search_Result_Schema_Piece_Handler
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Generate_Search_Result_Schema_Piece_Handler_Test extends TestCase {

	/**
	 * The subject of testing.
	 *
	 * @var Generate_Search_Result_Schema_Piece_Handler $instance
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Generate_Search_Result_Schema_Piece_Handler();
	}

	/**
	 * Tests the handle method.
	 *
	 * @covers ::handle
	 * @return void
	 */
	public function test_handle(): void {
		$this->assertInstanceOf( Search_Result_Schema_Piece::class, $this->instance->handle( new Generate_Search_Result_Schema_Piece( 'the term.' ) ) );
	}
}
