<?php

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Robots_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Robots_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Robots_Presenter
 *
 * @group presenters
 */
class Robots_Presenter_Test extends TestCase {

	/**
	 * The robots presenter instance.
	 *
	 * @var Robots_Presenter
	 */
	private $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	private $presentation;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->presentation = new Indexable_Presentation();
		$this->instance     = Mockery::mock( Robots_Presenter::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->presentation           = new Indexable_Presentation();
		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->robots = [
			'index'  => 'index',
			'follow' => 'nofollow',
		];

		$actual   = $this->instance->present();
		$expected = '<meta name="robots" content="index, nofollow" />';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the situation where the presentation is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_empty() {
		$this->presentation->robots = [];

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->presentation->robots = [
			'index'  => 'index',
			'follow' => 'nofollow',
		];

		$this->assertSame(
			[
				'index'  => 'index',
				'follow' => 'nofollow',
			],
			$this->instance->get()
		);
	}
}
