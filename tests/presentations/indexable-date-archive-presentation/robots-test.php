<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Robots_Test.
 *
 * @group   presentations
 * @group   robots
 *
 * @package Yoast\Tests\Presentations\Indexable_Date_Archive_Presentation
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers \Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation::generate_robots
	 */
	public function test_generate_robots() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'noindex-archive-wpseo', false )
			->andReturn( false );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether generate_robots return noindex if archive indexation has been disabled.
	 *
	 * @covers \Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation::generate_robots
	 */
	public function test_generate_robots_date_archive_noindex() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'noindex-archive-wpseo', false )
			->andReturn( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}
}
