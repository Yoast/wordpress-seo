<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group robots
 */
class Robots_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots() {
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
	 * Tests whether generate_robots calls the right functions of the robot helper,
	 * using the wpseo_robots filter, with the filter returning false.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_with_filter_return_false() {
		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->once()
			->with( 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', $this->instance )
			->andReturn( 'noindex, nofollow' );

		$this->assertEquals(
			[
				'index'  => 'noindex',
				'follow' => 'nofollow',
			],
			$this->instance->generate_robots()
		);
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper,
	 * using the wpseo_robots filter, with the filter returning duplicate types.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_with_filter_returning_duplicates() {
		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->once()
			->with( 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', $this->instance )
			->andReturn( 'index, noindex, follow' );

		$this->assertEquals(
			[
				'index'  => 'noindex',
				'follow' => 'follow',
			],
			$this->instance->generate_robots()
		);
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper,
	 * using the wpseo_robots_array filter.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_with_array_filter() {
		Monkey\Filters\expectApplied( 'wpseo_robots_array' )
			->once()
			->with(
				[
					'index'             => 'index',
					'follow'            => 'follow',
					'max-snippet'       => 'max-snippet:-1',
					'max-image-preview' => 'max-image-preview:large',
					'max-video-preview' => 'max-video-preview:-1',
				],
				$this->instance
			)
			->andReturn(
				[
					'index'  => 'noindex',
					'follow' => 'nofollow',
				]
			);

		$this->assertEquals(
			[
				'index'  => 'noindex',
				'follow' => 'nofollow',
			],
			$this->instance->generate_robots()
		);
	}

	/**
	 * Tests whether filter robots removes values when noindex.
	 *
	 * @covers ::generate_robots
	 * @covers ::get_base_robots
	 * @covers ::filter_robots
	 */
	public function test_generate_robots_strip_values_when_noindex() {
		$this->instance->model->is_robots_noindex      = true;
		$this->instance->model->is_robots_nofollow     = true;
		$this->instance->model->is_robots_nosnippet    = true;
		$this->instance->model->is_robots_noimageindex = true;
		$this->instance->model->is_robots_noarchive    = true;

		$expected = [
			'index'  => 'noindex',
			'follow' => 'nofollow',
		];

		// Check the values are stripped before running the filter by comparing the input of the filter.
		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->twice()
			->with( 'noindex, nofollow', $this->instance )
			->andReturn( 'noindex, nofollow' );

		$this->assertEquals( $expected, $this->instance->generate_robots() );

		// Check again with snippet, imageindex and archive to false. It should not matter.
		$this->instance->model->is_robots_nosnippet    = false;
		$this->instance->model->is_robots_noimageindex = false;
		$this->instance->model->is_robots_noarchive    = false;

		$this->assertEquals( $expected, $this->instance->generate_robots() );
	}
}
