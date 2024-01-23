<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Basic;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Crawl_Cleanup_Basic_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Basic
 *
 * @group integrations
 * @group front-end
 */
final class Crawl_Cleanup_Basic_Test extends TestCase {

	/**
	 * Robots helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The test instance.
	 *
	 * @var Crawl_Cleanup_Basic|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Crawl_Cleanup_Basic( $this->options_helper );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Crawl_Cleanup_Basic::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		\add_action( 'wp_head', 'wp_generator' );
		\add_action( 'wp_head', 'rsd_link' );
		\add_action( 'xmlrpc_rsd_apis', 'rest_output_rsd' );
		\add_action( 'wp_head', 'wlwmanifest_link' );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_shortlinks' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_rest_api_links' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_rsd_wlw_links' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_oembed_links' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_generator' )
			->andReturn( false );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'remove_emoji_scripts' )
			->andReturn( true );

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'clean_headers' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'clean_headers' ] ) );

		// Toggle set to false.
		$this->assertNotFalse( Monkey\Actions\has( 'wp_head', 'wp_generator' ) );

		// Toggle set to true.
		$this->assertFalse( Monkey\Actions\has( 'wp_head', 'rsd_link' ) );
		$this->assertFalse( Monkey\Actions\has( 'xmlrpc_rsd_apis', 'rest_output_rsd' ) );
		$this->assertFalse( Monkey\Actions\has( 'wp_head', 'wlwmanifest_link' ) );
	}
}
