<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Presenters\Post_Type\Robots_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Presenter_Test
 *
 * @group presenters
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Post_Type\Robots_Presenter
 *
 * @package Yoast\WP\Free\Tests\Presenters
 */
class Robots_Presenter_Test extends TestCase {

	/**
	 * @var \Yoast\WP\Free\Presenters\Post_Type\Robots_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Robots_Presenter();

	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 *
	 * @covers ::generate
	 */
	public function test_generate_index_follow() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
		                    ->makePartial();

		$post_type->expects( 'is_post_type_indexable' )
		          ->once()
		          ->andReturn( true );

		Monkey\Functions\expect( 'get_post_status' )->once()->andReturn( 'published' );

		$indexable = new Indexable();

		$indexable->is_robots_noindex  = '0';
		$indexable->is_robots_nofollow = '0';

		$actual = $this->instance->generate( $indexable );;
		$expected = '';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Test whether the presenter returns a noindex when a post status is private.
	 *
	 * @covers ::generate
	 */
	public function test_generate_private_post() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
		                    ->makePartial();

		$post_type->expects( 'is_post_type_indexable' )
		          ->once()
		          ->andReturn( true );

		Monkey\Functions\expect( 'get_post_status' )->once()->andReturn( 'private' );

		$indexable = new Indexable();

		$indexable->is_robots_noindex  = '0';
		$indexable->is_robots_nofollow = '0';

		$actual = $this->instance->generate( $indexable );;
		$expected = 'noindex,follow';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Test whether the presenter returns a noindex when a post type is configured to not be indexed.
	 *
	 * @covers ::generate
	 */
	public function test_generate_non_indexable_post_type() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
		                    ->makePartial();

		$post_type->expects( 'is_post_type_indexable' )
		          ->once()
		          ->andReturn( false );

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->andReturn( 'published' );

		$indexable = new Indexable();

		$indexable->is_robots_noindex  = '0';
		$indexable->is_robots_nofollow = '0';

		$actual = $this->instance->generate( $indexable );;
		$expected = 'noindex,follow';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Test whether the presenter returns a noindex when website is set to not be indexed by search engines.
	 *
	 * @covers ::generate
	 */
	public function test_generate_private_blog() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
		                    ->makePartial();

		$post_type->expects( 'is_post_type_indexable' )
		          ->once()
		          ->andReturn( true );

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->andReturn( 'published' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '0' );

		$indexable = new Indexable();

		$indexable->is_robots_noindex  = '0';
		$indexable->is_robots_nofollow = '0';

		$actual = $this->instance->generate( $indexable );;
		$expected = 'noindex,follow';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Test whether the presenter returns a noindex when a page refers to a comment reply.
	 *
	 * @covers ::generate
	 */
	public function test_generate_replytocom() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
		                    ->makePartial();

		$post_type->expects( 'is_post_type_indexable' )
		          ->once()
		          ->andReturn( true );

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->andReturn( 'published' );

		$_GET['replytocom'] = '123';

		$indexable = new Indexable();

		$indexable->is_robots_noindex  = '0';
		$indexable->is_robots_nofollow = '0';

		$actual = $this->instance->generate( $indexable );;
		$expected = 'noindex,follow';

		$this->assertEquals( $expected, $actual );

		unset( $_GET['replytocom'] );
	}

	/**
	 * Test special robot instructions.
	 *
	 * @covers ::generate
	 */
	public function test_generate_noimageindex_noarchive_nosnippet() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
		                    ->makePartial();

		$post_type->expects( 'is_post_type_indexable' )
		          ->once()
		          ->andReturn( true );

		Monkey\Functions\expect( 'get_post_status' )->once()->andReturn( 'published' );

		$indexable = new Indexable();

		$indexable->is_robots_noindex      = '0';
		$indexable->is_robots_nofollow     = '0';
		$indexable->is_robots_noimageindex = '1';
		$indexable->is_robots_noarchive    = '1';
		$indexable->is_robots_nosnippet    = '1';

		$actual = $this->instance->generate( $indexable );;
		$expected = 'noimageindex,noarchive,nosnippet';

		$this->assertEquals( $expected, $actual );
	}
}
