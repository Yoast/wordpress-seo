<?php

namespace Yoast\WP\SEO\Tests\Unit\Schema\Domain;

use Yoast\WP\SEO\Schema\Domain\Search_Term;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Search_Term_Test.
 *
 * @group schema
 * @group search-result-schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\Domain\Search_Term
 */
class Search_Term_Test extends TestCase {

	/**
	 * The subject of testing.
	 *
	 * @var Search_Term $instance
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Search_Term( 'the_query' );
	}

	/**
	 * Tests the get query method.
	 *
	 * @covers ::get_query
	 * @return void
	 */
	public function test_get_query(): void {
		$this->assertSame( 'the_query', $this->instance->get_query() );
	}
}
