<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Admin\Redirect_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Redirect_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Redirect_Integration
 *
 * @group integrations
 */
class Redirect_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Redirect_Integration
	 */
	protected $instance;

	/**
	 * The current page helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page;

	/**
	 * The redirect helper mock.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	private $redirect;

	/**
	 * Set up the fixtures for the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->redirect     = Mockery::mock( Redirect_Helper::class );

		$this->instance = new Redirect_Integration( $this->current_page, $this->redirect );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Admin_Conditional::class,
			],
			Redirect_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( Monkey\Actions\has( 'admin_init', [ $this->instance, 'old_settings_redirect' ] ), 'Does not have expected admin_init filter' );
	}

	/**
	 * Tests old_settings_redirect.
	 *
	 * @dataProvider provider_old_settings_redirect
	 * @covers ::add_submenu_page
	 *
	 * @param string $current_page   The current page parameter.
	 * @param int    $redirect_times The times we will redirect.
	 */
	public function test_old_settings_redirect( $current_page, $redirect_times ) {
		$this->current_page->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( $current_page );

		Monkey\Functions\expect( 'admin_url' )
			->times( $redirect_times )
			->with( 'admin.php?page=wpseo_page_settings#/site-representation' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_settings#/site-representation' );

		$this->redirect->expects( 'do_safe_redirect' )
			->times( $redirect_times )
			->with( 'https://example.com/wp-admin/admin.php?page=wpseo_page_settings#/site-representation', 301 )
			->andReturn( $current_page );

		$this->instance->old_settings_redirect();
	}

	/**
	 * Data provider for test_old_settings_redirect().
	 *
	 * @return array
	 */
	public function provider_old_settings_redirect() {
		return [
			[ 'wpseo_titles', 1 ],
			[ 'NOT_wpseo_titles', 0 ],
		];
	}
}
