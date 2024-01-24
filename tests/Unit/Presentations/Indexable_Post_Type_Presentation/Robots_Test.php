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

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'        => 'noindex',
			'follow'       => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}
}
