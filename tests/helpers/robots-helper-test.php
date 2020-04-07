<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Robots_Helper
 */
class Robots_Helper_Test extends TestCase {

	/**
	 * @var Robots_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Robots_Helper();
	}

	/**
	 * Tests setting 'index' to 'noindex' when 'index' is already set to 'noindex'.
	 *
	 * @covers ::set_robots_no_index
	 */
	public function test_set_robots_no_index_with_having_a_noindex_value() {
		$presentation         = new Indexable_Presentation();
		$presentation->robots = [ 'index' => 'noindex', 'follow' => 'follow' ];

		$this->assertEquals(
			'noindex,follow',
			$this->instance->set_robots_no_index( 'noindex,follow', $presentation )
		);
	}

	/**
	 * Tests setting 'index' to 'noindex' when 'index' is set to 'index'.
	 *
	 * @covers ::set_robots_no_index
	 */
	public function test_set_robots_no_index_when_already_set() {
		$presentation         = new Indexable_Presentation();
		$presentation->robots = [ 'index' => 'index', 'follow' => 'follow' ];

		$this->assertEquals(
			'noindex,follow',
			$this->instance->set_robots_no_index( 'index,follow', $presentation )
		);
	}

	/**
	 * Tests setting 'index' to 'noindex' when the array contains empty values.
	 *
	 * @covers ::set_robots_no_index
	 */
	public function test_set_robots_no_index_with_empty_value() {
		$presentation         = new Indexable_Presentation();
		$presentation->robots = [
			'index'  => 'index',
			'follow' => 'follow',
			0        => '',
			1        => '',
		];

		$this->assertEquals(
			'noindex,follow',
			$this->instance->set_robots_no_index( 'index,follow', $presentation )
		);
	}
}
