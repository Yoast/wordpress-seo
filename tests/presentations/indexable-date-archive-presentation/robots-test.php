<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
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

		$this->setInstance();
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 */
	public function test_generate_robots() {
		$this->robots_helper
			->expects( 'get_base_values' )
			->andReturn( [
				'index' =>  'index',
				'follow' => 'follow',
			] );

		$this->robots_helper
			->expects( 'after_generate' )
			->with( [
				'index' =>  'index',
				'follow' => 'follow',
			] )
			->andReturnUsing( function( $robots ) {
				return $robots;
			} );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'noindex-archive-wpseo', false )
			->andReturn( false );

		$actual = $this->instance->generate_robots();
		$expected = [
			'index' =>  'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether generate_robots return noindex if archive indexation has been disabled.
	 */
	public function test_generate_robots_date_archive_noindex() {
		$this->robots_helper
			->expects( 'get_base_values' )
			->andReturn( [
				'index' =>  'index',
				'follow' => 'follow',
			] );

		$this->robots_helper
			->expects( 'after_generate' )
			->with( [
				'index' =>  'noindex',
				'follow' => 'follow',
			] )
			->andReturnUsing( function( $robots ) {
				return $robots;
			} );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'noindex-archive-wpseo', false )
			->andReturn( true );

		$actual = $this->instance->generate_robots();
		$expected = [
			'index' =>  'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}
}
