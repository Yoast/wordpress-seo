<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Author_Archive_Helper
 */
final class Author_Archive_Helper_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var Author_Archive_Helper|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Author_Archive_Helper::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests whether the wpseo_author_archive_post_types filter is applied properly.
	 *
	 * @covers ::get_author_archive_post_types
	 *
	 * @return void
	 */
	public function test_get_author_archive_post_types_apply_filter() {
		Monkey\Filters\expectApplied( 'wpseo_author_archive_post_types' )
			->once();

		$expected = [ 'post' ];

		$this->assertEquals( $expected, $this->instance->get_author_archive_post_types() );
	}

	/**
	 * Tests that true is returned when the author has a public post.
	 *
	 * @covers ::author_has_public_posts
	 *
	 * @return void
	 */
	public function test_author_has_public_posts_with_public_post() {
		$this->instance->expects( 'author_has_a_public_post' )->once()->with( 1 )->andReturnTrue();

		$this->assertTrue( $this->instance->author_has_public_posts( 1 ) );
	}

	/**
	 * Tests that null is returned when the author has a post without noindex override.
	 *
	 * @covers ::author_has_public_posts
	 *
	 * @return void
	 */
	public function test_author_has_public_posts_with_post_without_override() {
		$this->instance->expects( 'author_has_a_public_post' )->once()->with( 1 )->andReturnFalse();
		$this->instance->expects( 'author_has_a_post_with_is_public_null' )->once()->with( 1 )->andReturnTrue();

		$this->assertNull( $this->instance->author_has_public_posts( 1 ) );
	}

	/**
	 * Tests that false is returned when the author has no public posts and no posts without an override.
	 *
	 * @covers ::author_has_public_posts
	 *
	 * @return void
	 */
	public function test_author_has_public_posts_without_public_or_override_posts() {
		$this->instance->expects( 'author_has_a_public_post' )->once()->with( 1 )->andReturnFalse();
		$this->instance->expects( 'author_has_a_post_with_is_public_null' )->once()->with( 1 )->andReturnFalse();

		$this->assertFalse( $this->instance->author_has_public_posts( 1 ) );
	}
}
