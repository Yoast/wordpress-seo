<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Post_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Post_Helper
 */
final class Post_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Post_Helper
	 */
	private $instance;

	/**
	 * The string helper.
	 *
	 * @var Mockery\MockInterface|String_Helper
	 */
	private $string;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->string           = Mockery::mock( String_Helper::class );
		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->instance         = new Post_Helper( $this->string, $this->post_type_helper );
	}

	/**
	 * Tests the get_post_title_with_fallback method when the post has a title.
	 *
	 * @covers ::get_post_title_with_fallback
	 *
	 * @return void
	 */
	public function test_get_post_title_with_fallback() {
		Monkey\Functions\expect( 'get_the_title' )
			->with( 1 )
			->andReturn( 'My awesome post title' );

		$expected = 'My awesome post title';
		$actual   = $this->instance->get_post_title_with_fallback( 1 );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the get_post_title_with_fallback method when the post has an empty title.
	 *
	 * @covers ::get_post_title_with_fallback
	 *
	 * @return void
	 */
	public function test_get_post_title_with_fallback_no_title() {
		Monkey\Functions\expect( 'get_the_title' )
			->with( 1 )
			->andReturn( '' );

		$expected = 'No title';
		$actual   = $this->instance->get_post_title_with_fallback( 1 );

		$this->assertEquals( $expected, $actual );
	}
}
