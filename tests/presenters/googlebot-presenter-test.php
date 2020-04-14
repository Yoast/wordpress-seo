<?php

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Googlebot_Presenter;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
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
	 * Represents the indexable.
	 *
	 * @var Indexable
	 */
	protected $indexable;

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
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Googlebot_Presenter::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->indexable           = new Indexable();
		$this->presentation        = Mockery::mock( Indexable_Presentation::class );
		$this->presentation->model = $this->indexable;

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->googlebot = [ 'one', 'two', 'three' ];

		$actual   = $this->instance->present();
		$expected = '<meta name="googlebot" content="one, two, three" />';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present_with_robots_set_to_no_index() {
		$this->indexable->is_robots_noindex = true;

		$this->assertEquals( '', $this->instance->present() );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag, when the `wpseo_googlebot` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->presentation->googlebot = [ 'one', 'two', 'three' ];

		Monkey\Filters\expectApplied( 'wpseo_googlebot' )
			->once()
			->with( 'one, two, three', $this->presentation )
			->andReturn( 'one, two' );

		$actual = $this->instance->present();
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

		$this->assertEmpty( $this->instance->present() );
	}
}
