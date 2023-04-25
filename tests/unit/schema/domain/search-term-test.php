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
	 * Tests the get query method.
	 *
	 * @covers ::get_query
	 * @covers ::__construct
	 * @return void
	 */
	public function test_get_query(): void {
		$instance = new Search_Term( 'the_query' );
		$this->assertSame( 'the_query', $instance->get_query() );
	}
}
