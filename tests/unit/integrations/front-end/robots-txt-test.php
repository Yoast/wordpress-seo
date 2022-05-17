<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Robots_Txt;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WP_Robots_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\WP_Robots_Integration
 *
 * @group integrations
 * @group front-end
 */
class Robots_Txt_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Represents the instance to test.
	 *
	 * @var Robots_Txt
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = Mockery::mock( Robots_Txt::class, [ $this->options ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Robots_Txt::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		static::assertNotFalse( \has_filter( 'robots_txt', [ $this->instance, 'filter_robots' ] ) );
	}

	/**
	 * Tests the add_robots with having the robots input value being a string.
	 *
	 * @covers ::add_robots
	 * @covers ::get_robots_value
	 */
	public function test_public_site_with_sitemaps() {
		$this->options
			->expects( 'get' )
			->with( 'enable_xml_sitemap', false )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->andReturn( 'https://example.com' );

		static::assertContains( 'Sitemap: https://example.com/sitemap_index.xml', $this->instance->filter_robots( 'Input', '1' ) );
	}

	/**
	 * Tests the add_robots with having the robots input value being a string.
	 *
	 * @covers ::add_robots
	 * @covers ::get_robots_value
	 */
	public function test_public_site_without_sitemaps() {
		$this->options
			->expects( 'get' )
			->with( 'enable_xml_sitemap', false )
			->once()
			->andReturnFalse();

		static::assertDoesNotMatchRegularExpression( '/Sitemap:/', $this->instance->filter_robots( 'Input', '1' ) );
	}

	/**
	 * Tests the add_robots with having the robots input value being a string.
	 *
	 * @covers ::add_robots
	 * @covers ::get_robots_value
	 */
	public function test_nonpublic_site() {
		static::assertDoesNotMatchRegularExpression( '/Sitemap:/', $this->instance->filter_robots( 'Input', '0' ) );
	}
}
