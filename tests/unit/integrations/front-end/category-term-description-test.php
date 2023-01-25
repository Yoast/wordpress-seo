<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Front_End\Category_Term_Description;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Category_Term_Description_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Category_Term_Description
 *
 * @group integrations
 * @group front-end
 */
class Category_Term_Description_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Category_Term_Description
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Category_Term_Description();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Category_Term_Description::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'category_description', [ $this->instance, 'add_shortcode_support' ] ) );
		$this->assertNotFalse( Monkey\Filters\has( 'term_description', [ $this->instance, 'add_shortcode_support' ] ) );
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
