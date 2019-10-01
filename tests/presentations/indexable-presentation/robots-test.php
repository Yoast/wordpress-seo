<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class WPSEO_Schema_FAQ_Questions_Test.
 *
 * @group schema
 *
 * @package Yoast\Tests\Frontend\Schema
 */
class Robots_Test extends TestCase {

	/**
	 * @var Indexable_Presentation
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$indexable = new Indexable();

		$instance = new Indexable_Presentation();

		$this->instance = $instance->of( $indexable );
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 */
	public function test_generate_robots() {
		$robots_helper       = Mockery::mock( Robots_Helper::class );
		$current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$robots_helper->expects( 'get_base_values' )
			->andReturn( [
				'index' =>  'index',
				'follow' => 'follow',
			] );
		$robots_helper->expects( 'after_generate' )
			->with( [
				'index' =>  'index',
				'follow' => 'follow',
			] )
			->andReturnUsing( function( $robots ) {
				$robots['index'] = 'noindex';

				return $robots;
			} );

		$this->instance->set_helpers( $robots_helper, $current_page_helper );

		$actual = $this->instance->generate_robots();
		$expected = [
			'index' =>  'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $actual, $expected );
	}
}
