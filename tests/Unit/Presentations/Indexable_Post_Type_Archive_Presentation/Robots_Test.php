<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Archive_Presentation
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
	public function test_generate_robots_dont_index_post_type() {
		$this->indexable->object_id       = 1337;
		$this->indexable->object_sub_type = 'post';

		$this->options
			->expects( 'get' )
			->with( 'noindex-ptarchive-post', false )
			->andReturn( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_index_post_type() {
		$this->indexable->object_id       = 1337;
		$this->indexable->object_sub_type = 'post';

		$this->options
			->expects( 'get' )
			->with( 'noindex-ptarchive-post', false )
			->andReturn( false );

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
}
