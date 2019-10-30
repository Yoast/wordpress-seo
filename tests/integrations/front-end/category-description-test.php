<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\Free\Tests\Integrations\Front_End
 */

namespace Yoast\WP\Free\Tests\Integrations\Front_End;

use Brain\Monkey;
use Yoast\WP\Free\Integrations\Front_End\Category_Description;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Front_End\Category_Description
 * @covers ::<!public>
 *
 * @group integrations
 * @group front-end
 */
class Category_Description_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Category_Description
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Category_Description();
	}

	/**
	 * Tests the add shortcode support functionality.
	 *
	 * @covers ::add_shortcode_support
	 */
	public function test_add_shortcode_support() {
		Monkey\Functions\when( 'do_shortcode' )
			->returnArg( 1 );

		$this->assertEquals(
			'This is a category text',
			$this->instance->add_shortcode_support( 'This is a category text' )
		);
	}
}
