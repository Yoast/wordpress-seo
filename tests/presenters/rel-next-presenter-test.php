<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Rel_Next_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Rel_Next_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Rel_Next_Presenter
 *
 * @group presentations
 * @group rel-next
 */
class Rel_Next_Presenter_Test extends TestCase {

	/**
	 * @var Rel_Next_Presenter|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Set up.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Rel_Next_Presenter();
	}

	/**
	 * Tests the presentation of the rel next meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$presentation = new Indexable_Presentation();

		$presentation->rel_next = 'https://permalink/post/2';
		$presentation->robots    = [];

		$this->assertEquals(
			'<link rel="next" href="https://permalink/post/2" />',
			$this->instance->present( $presentation )
		);
	}

	/**
	 * Tests the presentation of the rel prev next tag when it's empty.
	 *
	 * @covers ::present
	 */
	public function test_present_empty() {
		$presentation = new Indexable_Presentation();

		$presentation->rel_next = '';
		$presentation->robots    = [];

		$this->assertEquals(
			'',
			$this->instance->present( $presentation )
		);
	}

	/**
	 * Tests the presentation of the rel next meta tag when robots is noindex.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_when_robots_is_noindex() {
		$presentation = new Indexable_Presentation();

		$presentation->rel_next = 'https://permalink/post/2';
		$presentation->robots   = [ 'noindex' ];

		$this->assertEmpty( $this->instance->present( $presentation ) );
	}
}
