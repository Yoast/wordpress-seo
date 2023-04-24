<?php

namespace Yoast\WP\SEO\Tests\Unit\Schema\Domain;

use Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece;
use Yoast\WP\SEO\Schema\Domain\Search_Term;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Search_Result_Schema_Piece_Test.
 *
 * @group schema
 * @group search-result-schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\Domain\Search_Result_Schema_Piece
 */
class Search_Result_Schema_Piece_Test extends TestCase {

	/**
	 * The subject of testing.
	 *
	 * @var Search_Result_Schema_Piece $instance
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$context_mock = new Meta_Tags_Context_Mock();

		$search_term             = new Search_Term( 'the_query' );
		$this->instance          = new Search_Result_Schema_Piece( $search_term );
		$this->instance->context = $context_mock;
	}

	/**
	 * Tests the is needed function, this should always return true for this schema piece.
	 *
	 * @covers ::is_needed
	 * @return void
	 */
	public function test_is_needed(): void {
		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests the generate function.
	 *
	 * @covers ::generate
	 * @return void
	 */
	public function test_generate() {
		$this->assertSame(
			[
				'@type'        => 'SearchAction',
				'actionStatus' => 'https://schema.org/CompletedActionStatus',
				'query'        => 'the_query',
				'result'       => [
					'@id' => null,
				],
			],
			$this->instance->generate()
		);
	}
}
