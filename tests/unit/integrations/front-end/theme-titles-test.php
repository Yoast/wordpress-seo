<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Unit\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Front_End\Theme_Titles;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Theme_Titles
 * @covers ::<!public>
 *
 * @group integrations
 * @group front-end
 */
class Theme_Titles_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Theme_Titles
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Theme_Titles();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Theme_Titles::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'thematic_doctitle', [ $this->instance, 'title' ] ) );
		$this->assertNotFalse( Monkey\Filters\has( 'woo_title', [ $this->instance, 'title' ] ) );
	}

	/**
	 * Tests the execution of the title function.
	 *
	 * @covers ::title
	 */
	public function test_title() {
		Monkey\Functions\expect( '_deprecated_function' )
			->once()
			->with(
				'Yoast\WP\SEO\Integrations\Front_End\Theme_Titles::title',
				'WPSEO 14.0',
				'a theme that has proper title-tag theme support, or adapt your theme to have that support'
			);

		$this->assertEquals( 'title', $this->instance->title( 'title' ) );
	}
}
