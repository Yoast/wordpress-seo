<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Yoast\WP\Free\Tests\Doubles\Presenters\Post_Type\Robots_Presenter_Double;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Presenter_Test
 *
 * @group presenters
 *
 * @package Yoast\WP\Free\Tests\Presenters
 */
class Robots_Presenter_Test extends TestCase {

	/**
	 * @var \Yoast\WP\Free\Presenters\Post_Type\Robots_Presenter_Double
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Robots_Presenter_Double();
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 */
	public function test_generate() {
		$post_type = Mockery::mock( 'alias:WPSEO_Post_Type' )
			->makePartial();

		$post_type->expects( 'is_post_type_indexable' )->once()->andReturn( true );

		$this->instance->generate( Mockery::mock( 'Yoast\WP\Free\Models\Indexable' ) );

		$actual = '';
		$expected = '';

		$this->assertEquals( $actual, $expected );
	}
}
