<?php

namespace Yoast\WP\Free\Tests\Helpers;

use Brain\Monkey;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Robots_Helper
 */
class Robots_Helper_Test extends TestCase {

	/**
	 * @var Robots_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Robots_Helper();
	}

	/**
	 * Tests whether the get_base_values function returns the right values when noindex and nofollow are true.
	 *
	 * @covers ::get_base_values
	 */
	public function test_get_base_values_true() {
		$indexable = new Indexable();

		$indexable->is_robots_nofollow = true;
		$indexable->is_robots_noindex  = true;

		$actual = $this->instance->get_base_values( $indexable );

		$expected = [
			'index' => 'noindex',
			'follow' => 'nofollow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the get_base_values function returns the right values when noindex and nofollow are false.
	 *
	 * @covers ::get_base_values
	 */
	public function test_get_base_values_false() {
		$indexable = new Indexable();

		$indexable->is_robots_nofollow = false;
		$indexable->is_robots_noindex  = false;

		$actual = $this->instance->get_base_values( $indexable );

		$expected = [
			'index' => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests if after_generate strips index and follow from the object if they are 'index' and 'follow' respectively.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$actual = $this->instance->after_generate( [
			'index' => 'index',
			'follow' => 'follow',
		] );

		$expected = [];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests if after_generate sets index to 'noindex' is the blog is set to not be public.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate_blog_not_public() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '0' );

		$actual = $this->instance->after_generate( [
			'index' => 'index',
			'follow' => 'follow',
		] );

		$expected = [
			'index' => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests if after_generate sets index to 'noindex' if the page is a reply to comment page.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate_blog_replytocom() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$_GET['replytocom'] = '123';

		$actual = $this->instance->after_generate( [
			'index' => 'index',
			'follow' => 'follow',
		] );

		$expected = [
			'index' => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );

		unset( $_GET['replytocom'] );
	}

	/**
	 * Tests if after_generate removes null values from the robots options array.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate_blog_clean_null_values() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$actual = $this->instance->after_generate( [
			'index' => 'index',
			'follow' => 'follow',
			'noimageindex' => 'noimageindex',
			'nosnippet' => null,
			'noarchive' => null,
		] );

		$expected = [
			'noimageindex' => 'noimageindex',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests if additional values are set when noindex and nosnippet are set.
	 *
	 * @covers ::after_generate
	 */
	public function test_after_generate_with_no_index_and_nosnippet() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$actual = $this->instance->after_generate( [
			'noindex'   => 'noindex',
			'nosnippet' => 'nosnippet',
		] );

		$expected = [
			'noindex'           => 'noindex',
			'nosnippet'         => 'nosnippet',
			'max-snippet'       => 'max-snippet:-1',
			'max-image-preview' => 'max-image-preview:large',
			'max-video-preview' => 'max-video-preview:-1',
		];

		$this->assertEquals( $expected, $actual );
	}
}
