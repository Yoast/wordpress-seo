<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class User_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\User_Helper
 */
class User_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var User_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new User_Helper();
	}

	/**
	 * Tests that `count_posts` converts a string to an integer.
	 *
	 * @covers ::count_posts
	 */
	public function test_count_user_posts() {
		Functions\expect( 'count_user_posts' )
			->with( 1, 'post', true )
			->once()
			->andReturn( '0' );

		$actual = $this->instance->count_posts( 1, 'post' );

		$this->assertEquals( 0, $actual );
	}
}
