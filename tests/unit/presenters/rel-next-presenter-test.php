<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Rel_Next_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Rel_Next_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Rel_Next_Presenter
 *
 * @group presenters
 * @group rel-next
 */
class Rel_Next_Presenter_Test extends TestCase {

	/**
	 * The rel next presenter instance.
	 *
	 * @var Rel_Next_Presenter|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Rel_Next_Presenter();
	}

	/**
	 * Tests the presentation of the rel next meta tag.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;

		$presentation->rel_next = 'https://permalink/post/2';
		$presentation->robots   = [];

		$this->assertEquals(
			'<link rel="next" href="https://permalink/post/2" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation of the rel prev next tag when it's empty.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_empty() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;

		$presentation->rel_next = '';
		$presentation->robots   = [];

		$this->assertEquals(
			'',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation of the rel next meta tag when robots is noindex.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_when_robots_is_noindex() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;

		$presentation->rel_next = 'https://permalink/post/2';
		$presentation->robots   = [ 'noindex' ];

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presentation of the rel next meta tag with filter.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_filter() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;

		$presentation->rel_next = 'https://permalink/post/2';
		$presentation->robots   = [];

		Monkey\Filters\expectApplied( 'wpseo_adjacent_rel_url' )
			->with( 'https://permalink/post/2', 'next' )
			->once()
			->andReturn( 'https://filtered' );

		$this->assertEquals(
			'<link rel="next" href="https://filtered" />',
			$this->instance->present()
		);
	}
}
