<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin\Addon_Installation;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Integrations\Admin\Addon_Installation\Dialog_Integration;

class Dialog_Integration_Test extends TestCase {

	/**
	 * The addon manager.
	 *
	 * @var \WPSEO_Addon_Manager
	 */
	protected $wpseo_addon_manager;

	/**
	 * The instance to test.
	 *
	 * @var Dialog_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wpseo_addon_manager = Mockery::mock( \WPSEO_Addon_Manager::class );
		$this->instance            = new Dialog_Integration( $this->wpseo_addon_manager );
	}

	public function test_register_hooks() {

		$this->instance->register_hooks();

		$this->assertSame( 10, has_action( 'admin_init', [ $this->instance, 'start_addon_installation' ] ) );
	}

	public function test_start_addon_installation_returns_when_install_url_parameter_is_false() {

		$_GET['install'] = 'false';

		$this->instance->start_addon_installation();

		$this->assertFalse( has_action( 'admin_enqueue_scripts', [ $this->instance, 'show_modal' ] ) );
		$this->assertFalse( has_action( 'admin_notices', [ $this->instance, 'throw_no_owned_addons_warning' ] ) );
	}

	public function test_start_addon_installation_when_no_owned_subscriptions() {

		$_GET['install'] = 'true';

		$owned_subscriptions = (object) [
			'subscriptions' => [],
		];

		$this->wpseo_addon_manager
			->expects( 'remove_site_information_transients' )
			->once();

		$this->wpseo_addon_manager
			->expects( 'get_myyoast_site_information' )
			->once()
			->andReturn( $owned_subscriptions );


		$this->instance->start_addon_installation();

		$this->assertSame( 10, has_action( 'admin_notices', [ $this->instance, 'throw_no_owned_addons_warning' ] ) );
		$this->assertFalse( has_action( 'admin_enqueue_scripts' ) );
	}

	public function test_start_addon_installation() {

		$_GET['install'] = 'true';

		$owned_subscriptions = (object) [
			'subscriptions' => [
				(object) [
					'product' => (object) [
						'slug' => 'Premium_slug',
						'name' => 'Premium_name',
					],
				],
			],
		];

		$this->wpseo_addon_manager
			->expects( 'remove_site_information_transients' )
			->once();

		$this->wpseo_addon_manager
			->expects( 'get_myyoast_site_information' )
			->once()
			->andReturn( $owned_subscriptions );


		$this->instance->start_addon_installation();

		$this->assertSame( 10, has_action( 'admin_enqueue_scripts', [ $this->instance, 'show_modal' ] ) );
		$this->assertFalse( has_action( 'admin_notices' ) );
	}
}
