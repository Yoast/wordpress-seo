<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Social_Bulk_Update_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for register_routes of the social bulk update route.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Abstract_Bulk_Update_Route::register_routes
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Social_Bulk_Update_Route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Social_Bulk_Update_Route_Register_Routes_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Social_Bulk_Update_Route
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Social_Bulk_Update_Route( Mockery::mock( Bulk_Updater::class ) );
	}

	/**
	 * Tests the route is registered under its own prefix.
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/bulk_editor/update_social',
				Mockery::on(
					static function ( $options ) {
						return $options['args']['items']['required'] === true
							&& $options['args']['items']['type'] === 'array'
							&& \is_callable( $options['args']['items']['validate_callback'] );
					},
				),
			);

		$this->instance->register_routes();
	}
}
