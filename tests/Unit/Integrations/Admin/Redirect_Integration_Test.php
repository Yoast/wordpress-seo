<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
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
final class Redirect_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Redirect_Integration
	 */
	protected $instance;

	/**
	 * The redirect helper mock.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	private $redirect;

	/**
	 * Set up the fixtures for the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->redirect = Mockery::mock( Redirect_Helper::class );

		$this->instance = new Redirect_Integration( $this->redirect );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertEquals( $this->redirect, $this->getPropertyValue( $this->instance, 'redirect' ) );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
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
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( Monkey\Actions\has( 'wp_loaded', [ $this->instance, 'old_settings_redirect' ] ), 'Does not have expected wp_loaded filter' );
	}

	/**
	 * Tests old_settings_redirect.
	 *
	 * @dataProvider provider_old_settings_redirect
	 * @covers ::old_settings_redirect
	 *
	 * @param string $current_page   The current page parameter.
	 * @param int    $redirect_times The times we will redirect.
	 *
	 * @return void
	 */
	public function test_old_settings_redirect( $current_page, $redirect_times ) {
		$_GET['page'] = $current_page;

		Monkey\Functions\expect( 'admin_url' )
			->times( $redirect_times )
			->with( 'admin.php?page=wpseo_page_settings#/site-representation' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_settings#/site-representation' );

		$this->redirect->expects( 'do_safe_redirect' )
			->times( $redirect_times )
			->with( 'https://example.com/wp-admin/admin.php?page=wpseo_page_settings#/site-representation', 301 );

		$this->instance->old_settings_redirect();
	}

	/**
	 * Data provider for test_old_settings_redirect().
	 *
	 * @return array
	 */
	public static function provider_old_settings_redirect() {
		return [
			[ 'wpseo_titles', 1 ],
			[ 'NOT_wpseo_titles', 0 ],
		];
	}
}
