<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Test
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 */
final class Robots_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_extra_directives() {
		$this->indexable->is_robots_nosnippet    = true;
		$this->indexable->is_robots_noarchive    = true;
		$this->indexable->is_robots_noimageindex = true;
		$this->indexable->object_id              = 1337;
		$this->indexable->object_sub_type        = 'post';

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'published' );

		$this->post_type->expects( 'is_indexable' )
			->once()
			->with( 'post' )
			->andReturn( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'             => 'index',
			'follow'            => 'follow',
			'snippet'           => 'nosnippet',
			'archive'           => 'noarchive',
			'imageindex'        => 'noimageindex',
			'max-video-preview' => 'max-video-preview:-1',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether index is set to noindex when a post's status is private.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_private_post() {
		$this->indexable->object_id       = 1337;
		$this->indexable->object_sub_type = 'post';

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'private' );

		$this->post_type
			->expects( 'is_indexable' )
			->once()
			->with( 'post' )
			->andReturn( true );

		$this->expect_post_type_defaults( 'post', false, false );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'        => 'noindex',
			'follow'       => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether index is set to noindex when a post type is set to not be indexed.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_post_type_not_indexable() {
		$this->indexable->object_id       = 1337;
		$this->indexable->object_sub_type = 'post';

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'published' );

		$this->post_type
			->expects( 'is_indexable' )
			->once()
			->with( 'post' )
			->andReturn( false );

		$this->expect_post_type_defaults( 'post', false, false );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'        => 'noindex',
			'follow'       => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the noimageindex and noarchive defaults of the post type are used when the post does not set them.
	 *
	 * @covers ::generate_robots
	 * @covers ::has_robots_directive
	 *
	 * @return void
	 */
	public function test_generate_robots_post_type_defaults() {
		$this->indexable->object_id       = 1337;
		$this->indexable->object_sub_type = 'page';

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'publish' );

		$this->post_type
			->expects( 'is_indexable' )
			->once()
			->with( 'page' )
			->andReturn( true );

		$this->expect_post_type_defaults( 'page', true, true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'             => 'index',
			'follow'            => 'follow',
			'max-snippet'       => 'max-snippet:-1',
			'max-video-preview' => 'max-video-preview:-1',
			'imageindex'        => 'noimageindex',
			'archive'           => 'noarchive',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the post type defaults leave the robots value untouched when they are disabled.
	 *
	 * @covers ::generate_robots
	 * @covers ::has_robots_directive
	 *
	 * @return void
	 */
	public function test_generate_robots_post_type_defaults_disabled() {
		$this->indexable->object_id       = 1337;
		$this->indexable->object_sub_type = 'post';

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'publish' );

		$this->post_type
			->expects( 'is_indexable' )
			->once()
			->with( 'post' )
			->andReturn( true );

		$this->expect_post_type_defaults( 'post', false, false );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'             => 'index',
			'follow'            => 'follow',
			'max-snippet'       => 'max-snippet:-1',
			'max-image-preview' => 'max-image-preview:large',
			'max-video-preview' => 'max-video-preview:-1',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether a value set on the post itself takes precedence over the post type defaults.
	 *
	 * @covers ::generate_robots
	 * @covers ::has_robots_directive
	 *
	 * @return void
	 */
	public function test_generate_robots_post_value_overrides_post_type_default() {
		$this->indexable->object_id              = 1337;
		$this->indexable->object_sub_type        = 'post';
		$this->indexable->is_robots_noimageindex = false;
		$this->indexable->is_robots_noarchive    = true;

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'publish' );

		$this->post_type
			->expects( 'is_indexable' )
			->once()
			->with( 'post' )
			->andReturn( true );

		$this->options
			->expects( 'get' )
			->never();

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'             => 'index',
			'follow'            => 'follow',
			'max-snippet'       => 'max-snippet:-1',
			'max-image-preview' => 'max-image-preview:large',
			'max-video-preview' => 'max-video-preview:-1',
			'archive'           => 'noarchive',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Sets the expectations for retrieving the noimageindex and noarchive defaults of a post type.
	 *
	 * @param string $post_type    The post type.
	 * @param bool   $noimageindex The noimageindex default of the post type.
	 * @param bool   $noarchive    The noarchive default of the post type.
	 *
	 * @return void
	 */
	private function expect_post_type_defaults( $post_type, $noimageindex, $noarchive ) {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'noimageindex-' . $post_type, false )
			->andReturn( $noimageindex );

		$this->options
			->expects( 'get' )
			->once()
			->with( 'noarchive-' . $post_type, false )
			->andReturn( $noarchive );
	}
}
