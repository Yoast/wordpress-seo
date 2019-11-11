<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Search_Result_Page_Presentation;

use Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_URL_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Search_Result_Page_Presentation
 *
 * @group presentations
 */
class OG_URL_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the search link is returned.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url() {
		Monkey\Functions\expect( 'get_search_query' )
			->once()
			->andReturn( 'searchquery' );

		Monkey\Functions\expect( 'get_search_link' )
			->once()
			->andReturn( 'http://example.com/search/searchquery' );

		$this->assertEquals( 'http://example.com/search/searchquery', $this->instance->generate_og_url() );
	}

	/**
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url_invalid_query() {
		Monkey\Functions\expect( 'get_search_query' )
			->once()
			->andReturn( 'page/2' );

		$this->assertEmpty( $this->instance->generate_og_url() );
	}
}
