<?php

namespace Yoast\WP\SEO\Tests\Presenters;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Googlebot_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Googlebot_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Googlebot_Presenter
 *
 * @group   presenters
 */
class Googlebot_Presenter_Test extends TestCase {

	/**
	 * Represents the indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * The Googlebot presenter instance.
	 *
	 * @var Googlebot_Presenter
	 */
	private $instance;

	/**
	 * @var array
	 */
	private $googlebot;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Googlebot_Presenter::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->presentation           = Mockery::mock();
		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->googlebot = [ 'one', 'two', 'three' ];
		$this->presentation->robots    = [ 'index' => 'index' ];

		$actual   = $this->instance->present();
		$expected = '<meta name="googlebot" content="one, two, three" />';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns an empty string because of robots noindex.
	 *
	 * @covers ::present
	 */
	public function test_present_with_robots_set_to_no_index() {
		$this->presentation->googlebot = [];
		$this->presentation->robots    = [ 'index' => 'noindex' ];

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag, when the `wpseo_googlebot` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->presentation->googlebot = [ 'one', 'two', 'three' ];
		$this->presentation->robots    = [];

		Monkey\Filters\expectApplied( 'wpseo_googlebot' )
			->once()
			->with( 'one, two, three', $this->presentation )
			->andReturn( 'one, two' );

		$actual   = $this->instance->present();
		$expected = '<meta name="googlebot" content="one, two" />';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the situation where the presentation is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_empty() {
		$this->presentation->googlebot = [];
		$this->presentation->robots    = [];

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests retrieval of the raw value.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->presentation->googlebot = [ 'one', 'two', 'three' ];

		$this->assertEquals( [ 'one', 'two', 'three' ], $this->instance->get() );
	}
}
