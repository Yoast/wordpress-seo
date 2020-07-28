<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations
 */

namespace Yoast\WP\SEO\Tests\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Primary_Category;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Primary_Category
 *
 * @group integrations
 */
class Primary_Category_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Primary_Category|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Primary_Category::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the situation where the found post is null.
	 *
	 * @covers ::post_link_category
	 */
	public function test_post_link_category_where_post_is_null() {
		$category = (object) [ 'cat_ID' => 52 ];

		Monkey\Functions\expect( 'get_post' )->andReturn( null );

		$this->assertEquals( $category, $this->instance->post_link_category( $category ) );
	}

	/**
	 * Tests the situation when primary term id isn't to the category id, the id should get updated.
	 *
	 * @dataProvider post_link_category_provider
	 *
	 * @covers ::post_link_category
	 *
	 * @param int    $category_id The category id.
	 * @param int    $primary_id  The primary category id.
	 * @param int    $expected_id The expected category id.
	 * @param string $message     The message to show when test fails.
	 */
	public function test_post_link_category( $category_id, $primary_id, $expected_id, $message ) {
		$category          = (object) [ 'cat_ID' => $category_id ];
		$primary_category  = (object) [ 'cat_ID' => $primary_id ];
		$expected_category = (object) [ 'cat_ID' => $expected_id ];

		Monkey\Functions\expect( 'get_post' )->andReturn( [ 'ID' => 1337 ] );
		Monkey\Functions\when( 'get_category' )
			->justReturn( $primary_category );

		$this->instance
			->expects( 'get_primary_category' )
			->with( [ 'ID' => 1337 ] )
			->once()
			->andReturn( $primary_id );

		$this->assertEquals( $expected_category, $this->instance->post_link_category( $category ), $message );
	}

	/**
	 * Provides data to the post_link_category test.
	 *
	 * @return array The test data to use.
	 */
	public function post_link_category_provider() {
		return [
			[
				'category_id' => 52,
				'primary_id'  => 54,
				'expected_id' => 54,
				'message'     => 'Primary category is not the given category',
			],
			[
				'category_id' => 54,
				'primary_id'  => 54,
				'expected_id' => 54,
				'message'     => 'Primary category is the given category',
			],
			[
				'category_id' => 54,
				'primary_id'  => false,
				'expected_id' => 54,
				'message'     => 'Primary category is not set',
			],
		];
	}
}
