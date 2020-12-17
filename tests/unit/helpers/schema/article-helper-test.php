<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\Article_Helper
 */
class Article_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Article_Helper
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Article_Helper();
	}

	/**
	 * Tests the happy path.
	 *
	 * @covers ::is_article_post_type
	 */
	public function test_is_article_post_type() {
		$this->assertTrue( $this->instance->is_article_post_type( 'post' ) );
	}

	/**
	 * Tests the case where the post type is retrieved within the method.
	 *
	 * @covers ::is_article_post_type
	 */
	public function test_is_article_post_type_with_no_post_type_given() {
		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->andReturn( 'post' );

		$this->assertTrue( $this->instance->is_article_post_type() );
	}

	/**
	 * Tests the case where false is given as argumennt.
	 *
	 * @covers ::is_article_post_type
	 */
	public function test_is_article_post_type_with_false_given_as_post_type() {
		$this->assertFalse( $this->instance->is_article_post_type( false ) );
	}

	/**
	 * Tests the case where the post is not supported.
	 *
	 * @covers ::is_article_post_type
	 */
	public function test_is_article_post_type_with_post_type_not_supported() {
		$this->assertFalse( $this->instance->is_article_post_type( 'page' ) );
	}

	/**
	 * Tests the case where the post type is added by a filter.
	 *
	 * @covers ::is_article_post_type
	 */
	public function test_is_article_post_type_with_post_type_added_by_filter() {
		Monkey\Filters\expectApplied( 'wpseo_schema_article_post_types' )
			->once()
			->with( [ 'post' ] )
			->andReturn( [ 'post', 'page' ] );

		$this->assertTrue( $this->instance->is_article_post_type( 'page' ) );
	}
}
