<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Robots_Presenter;
use Yoast\WP\Free\Tests\Mocks\Indexable;
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
	 * @var Robots_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Robots_Presenter::class )
			->makePartial();

		$this->instance->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 */
	public function test_present() {
		$indexable_presentation = new Indexable_Presentation();
		$indexable_presentation->robots = [
			'index'  => 'index',
			'follow' => 'nofollow',
		];

		$actual = $this->instance->present( $indexable_presentation );
		$expected = '<meta name="robots" content="index,nofollow"/>';

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the presenter returns the correct meta tag, when the `wpseo_robots` filter is applied.
	 */
	public function test_present_filter() {
		$indexable_presentation = new Indexable_Presentation();
		$indexable_presentation->robots = [
			'index'  => 'index',
			'follow' => 'nofollow',
		];

		Monkey\Filters\expectApplied( 'wpseo_robots' )
			->once()
			->with( 'index,nofollow')
			->andReturn( 'noindex' );

		$actual = $this->instance->present( $indexable_presentation );
		$expected = '<meta name="robots" content="noindex"/>';

		$this->assertEquals( $actual, $expected );
	}
}
