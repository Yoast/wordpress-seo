<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Googlebot_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Googlebot_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Googlebot_Presenter
 *
 * @group presenters
 *
 * @package Yoast\WP\Free\Tests\Presenters
 */
class Googlebot_Presenter_Test extends TestCase {

	/**
	 * @var Googlebot_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Googlebot_Presenter::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$indexable_presentation = new Indexable_Presentation();
		$indexable_presentation->googlebot = [ 'one', 'two', 'three' ];

		$actual = $this->instance->present( $indexable_presentation );
		$expected = '<meta name="googlebot" content="one,two,three"/>';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag, when the `wpseo_googlebot` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$indexable_presentation = new Indexable_Presentation();
		$indexable_presentation->googlebot = [ 'one', 'two', 'three' ];

		Monkey\Filters\expectApplied( 'wpseo_googlebot' )
			->once()
			->with( 'one,two,three' )
			->andReturn( 'one,two' );

		$actual = $this->instance->present( $indexable_presentation );
		$expected = '<meta name="googlebot" content="one,two"/>';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests the situation where the presentation is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_empty() {
		$indexable_presentation = new Indexable_Presentation();
		$indexable_presentation->googlebot = [];

		$this->assertEmpty( $this->instance->present( $indexable_presentation ) );
	}
}
