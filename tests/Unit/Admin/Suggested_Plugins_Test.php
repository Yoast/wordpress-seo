<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Plugin_Availability;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use WPSEO_Suggested_Plugins;

/**
 * Suggested plugins tests.
 *
 * @coversDefaultClass WPSEO_Suggested_Plugins
 */
final class Suggested_Plugins_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var WPSEO_Suggested_Plugins
	 */
	protected $instance;

	/**
	 * Holds the availability checker.
	 *
	 * @var Mockery\MockInterface|WPSEO_Plugin_Availability
	 */
	protected $availability_checker;

	/**
	 * Holds the notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->availability_checker = Mockery::mock( WPSEO_Plugin_Availability::class );
		$this->notification_center  = Mockery::mock( Yoast_Notification_Center::class );
		$this->instance             = new WPSEO_Suggested_Plugins( $this->availability_checker, $this->notification_center );
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

		$this->assertEquals(
			10,
			has_action(
				'admin_init',
				[ $this->availability_checker, 'register' ],
			)
		);

		$this->assertEquals(
			10,
			has_action(
				'admin_init',
				[ $this->instance, 'add_notifications' ],
			)
		);
	}

	/**
	 * Tests the adding of notifications.
	 *
	 * @dataProvider data_add_notifications
	 * @covers ::add_notifications
	 *
	 * @param array       $plugins_with_dependencies The data of plugins with dependencies.
	 * @param array<bool> $satisfied_dependencies    Whether each plugin has their dependencies satisfied.
	 * @param int         $times_current_user_can    The amount of times if the current user can install plugins is checked.
	 * @param int         $times_check_installed     The amount of times if the installed plugins are checked.
	 * @param array<bool> $is_installed              Whether each plugin is installed.
	 * @param int         $times_check_is_active     The amount of times if the plugin is active is checked.
	 * @param array<bool> $is_active                 Whether each plugin is active.
	 * @param int         $times_get_current_user_id The amount of times the current user ID is retrieved.
	 * @param int         $times_add_notification    The amount of times a notification is added.
	 * @param int         $times_remove_notification The amount of times a notification is removed.
	 *
	 * @return void
	 */
	public function test_add_notifications( $plugins_with_dependencies, $satisfied_dependencies, $times_current_user_can, $times_check_installed, $is_installed, $times_check_is_active, $is_active, $times_get_current_user_id, $times_add_notification, $times_remove_notification ) {

		$this->availability_checker->expects( 'get_plugins_with_dependencies' )
			->once()
			->andReturn( $plugins_with_dependencies );

		$this->availability_checker->expects( 'dependencies_are_satisfied' )
			->times( count( $plugins_with_dependencies ) )
			->andReturn( ...$satisfied_dependencies );

		// To simplify the flow through WPSEO_Admin_Utils::get_install_link().
		Monkey\Functions\expect( 'current_user_can' )
			->times( $times_current_user_can )
			->with( 'install_plugins' )
			->andReturn( false );

		$this->availability_checker->expects( 'is_installed' )
			->times( $times_check_installed )
			->andReturn( ...$is_installed );

		$this->availability_checker->expects( 'is_active' )
			->times( $times_check_is_active )
			->andReturn( ...$is_active );

		Monkey\Functions\expect( 'get_current_user_id' )
			->times( $times_get_current_user_id )
			->andReturn( 1 );

		$this->notification_center->expects( 'add_notification' )
			->times( $times_add_notification );

		$this->notification_center->expects( 'remove_notification' )
			->times( $times_remove_notification );

		$this->instance->add_notifications();
	}

	/**
	 * The dataProvider for the test_override_error_messages test case.
	 *
	 * @return array
	 */
	public function data_add_notifications(): array {
		$installed_woo_plugin_with_dependency = [
			'yoast-woocommerce-seo' => [
				'url'           => 'https://yoa.st/1o0',
				'title'         => 'Yoast WooCommerce SEO',
				'_dependencies' => [
					'WooCommerce' => [
						'slug' => 'woocommerce/woocommerce.php',
					],
				],
				'installed'     => true,
				'slug'          => 'wpseo-woocommerce/wpseo-woocommerce.php',
			]
		];

		$not_installed_woo_plugin_with_dependency                                       = $installed_woo_plugin_with_dependency;
		$not_installed_woo_plugin_with_dependency['yoast-woocommerce-seo']['installed'] = false;

		$installed_random_plugin_with_dependency = [
			'yoast-random-seo' => [
				'url'           => 'https://yoa.st/rNd',
				'title'         => 'Yoast Random SEO',
				'_dependencies' => [
					'Random Dependency' => [
						'slug' => 'random/dependency.php',
					],
				],
				'installed'     => true,
				'slug'          => 'wpseo-random/wpseo-random.php',
			]
		];

		$not_installed_random_plugin_with_dependency                                       = $installed_random_plugin_with_dependency;
		$not_installed_random_plugin_with_dependency['yoast-random-seo']['installed'] = false;

		return [
			'No plugins with dependencies' => [
				'plugins_with_dependencies' => [],
				'satisfied_dependencies'    => [],
				'times_current_user_can'    => 0,
				'times_check_installed'     => 0,
				'is_installed'              => [],
				'times_check_is_active'     => 0,
				'is_active'                 => [],
				'times_get_current_user_id' => 0,
				'times_add_notification'    => 0,
				'times_remove_notification' => 0,
			],
			'One installed and active plugin with dependency and the dependency is satisfied' => [
				'plugins_with_dependencies' => $installed_woo_plugin_with_dependency,
				'satisfied_dependencies'    => [ true ],
				'times_current_user_can'    => 1,
				'times_check_installed'     => 1,
				'is_installed'              => [ true ],
				'times_check_is_active'     => 0,
				'is_active'                 => [],
				'times_get_current_user_id' => 1,
				'times_add_notification'    => 0,
				'times_remove_notification' => 1,
			],
			'One not installed plugin with dependency and the dependency is satisfied' => [
				'plugins_with_dependencies' => $not_installed_woo_plugin_with_dependency,
				'satisfied_dependencies'    => [ true ],
				'times_current_user_can'    => 1,
				'times_check_installed'     => 1,
				'is_installed'              => [ false ],
				'times_check_is_active'     => 1,
				'is_active'                 => [ false ],
				'times_get_current_user_id' => 1,
				'times_add_notification'    => 1,
				'times_remove_notification' => 0,
			],
			'One plugin with dependency and the dependency is not satisfied' => [
				'plugins_with_dependencies' => $installed_woo_plugin_with_dependency,
				'satisfied_dependencies'    => [ false ],
				'times_current_user_can'    => 0,
				'times_check_installed'     => 0,
				'is_installed'              => [],
				'times_check_is_active'     => 0,
				'is_active'                 => [],
				'times_get_current_user_id' => 0,
				'times_add_notification'    => 0,
				'times_remove_notification' => 0,
			],
			'Two installed plugins with dependencies and both dependencies are satisfied' => [
				'plugins_with_dependencies' => array_merge( $installed_woo_plugin_with_dependency, $installed_random_plugin_with_dependency ),
				'satisfied_dependencies'    => [ true ],
				'times_current_user_can'    => 2,
				'times_check_installed'     => 2,
				'is_installed'              => [ true ],
				'times_check_is_active'     => 0,
				'is_active'                 => [],
				'times_get_current_user_id' => 2,
				'times_add_notification'    => 0,
				'times_remove_notification' => 2,
			],
			'Two not installed plugins with dependencies and both dependencies are satisfied' => [
				'plugins_with_dependencies' => array_merge( $not_installed_woo_plugin_with_dependency, $not_installed_random_plugin_with_dependency ),
				'satisfied_dependencies'    => [ true ],
				'times_current_user_can'    => 2,
				'times_check_installed'     => 2,
				'is_installed'              => [ false ],
				'times_check_is_active'     => 2,
				'is_active'                 => [ false ],
				'times_get_current_user_id' => 2,
				'times_add_notification'    => 2,
				'times_remove_notification' => 0,
			],
			'Two not installed plugins with dependencies and both dependencies are satisfied' => [
				'plugins_with_dependencies' => array_merge( $installed_woo_plugin_with_dependency, $installed_random_plugin_with_dependency ),
				'satisfied_dependencies'    => [ false ],
				'times_current_user_can'    => 0,
				'times_check_installed'     => 0,
				'is_installed'              => [],
				'times_check_is_active'     => 0,
				'is_active'                 => [],
				'times_get_current_user_id' => 0,
				'times_add_notification'    => 0,
				'times_remove_notification' => 0,
			],
		];
	}
}
