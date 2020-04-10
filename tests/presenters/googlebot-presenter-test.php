<?php

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Googlebot_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Googlebot_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Googlebot_Presenter
 *
 * @group presenters
 *
 * @package Yoast\WP\SEO\Tests\Presenters
 */
class Googlebot_Presenter_Test extends TestCase {

	/**
	 * The Googlebot presenter instance.
	 *
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
		$this->instance->presentation      = new Indexable_Presentation();
		$indexable_presentation            = $this->instance->presentation;
		$indexable_presentation->googlebot = [ 'one', 'two', 'three' ];

		$actual   = $this->instance->present();
		$expected = '<meta name="googlebot" content="one, two, three" />';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag, when the `wpseo_googlebot` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->instance->presentation      = new Indexable_Presentation();
		$indexable_presentation            = $this->instance->presentation;
		$indexable_presentation->googlebot = [ 'one', 'two', 'three' ];

		Monkey\Filters\expectApplied( 'wpseo_googlebot' )
			->once()
			->with( 'one, two, three', $indexable_presentation )
			->andReturn( 'one, two' );

		$actual   = $this->instance->present();
		$expected = '<meta name="googlebot" content="one, two" />';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests the situation where the presentation is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_empty() {
		$this->instance->presentation      = new Indexable_Presentation();
		$indexable_presentation            = $this->instance->presentation;
		$indexable_presentation->googlebot = [];

		$this->assertEmpty( $this->instance->present() );
	}
}
