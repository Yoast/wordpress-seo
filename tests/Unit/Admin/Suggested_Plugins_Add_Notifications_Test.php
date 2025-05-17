<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;

/**
 * Test class for WPSEO_Suggested_Plugins::add_notifications.
 *
 * @covers WPSEO_Suggested_Plugins::add_notifications
 */
final class Suggested_Plugins_Add_Notifications_Test extends Suggested_Plugins_TestCase {

	/**
	 * Tests the adding of notifications.
	 *
	 * @covers WPSEO_Suggested_Plugins::add_notifications
	 * @covers WPSEO_Suggested_Plugins::get_yoast_seo_suggested_plugins_notification
	 * @covers WPSEO_Suggested_Plugins::create_install_suggested_plugin_message
	 * @covers WPSEO_Suggested_Plugins::create_more_information_link
	 * @dataProvider data_add_notifications
	 *
	 * @param array<string, array<string, string|bool|array<string, Conditional>>> $plugins_with_dependencies The data of plugins with dependencies.
	 * @param array<bool>                                                          $satisfied_dependencies    Whether each plugin has their dependencies satisfied.
	 * @param int                                                                  $times_check_installed     The amount of times if the installed plugins are checked.
	 * @param array<bool>                                                          $is_installed              Whether each plugin is installed.
	 * @param int                                                                  $times_add_notification    The amount of times a notification is added.
	 * @param int                                                                  $times_remove_notification The amount of times a notification is removed.
	 *
	 * @return void
	 */
	public function test_add_notifications( $plugins_with_dependencies, $satisfied_dependencies, $times_check_installed, $is_installed, $times_add_notification, $times_remove_notification ) {

		$this->availability_checker->expects( 'get_plugins_with_dependencies' )
			->once()
			->andReturn( $plugins_with_dependencies );

		$this->availability_checker->expects( 'dependencies_are_satisfied' )
			->times( \count( $plugins_with_dependencies ) )
			->andReturn( ...$satisfied_dependencies );

		// To simplify the flow through WPSEO_Admin_Utils::get_install_link().
		Monkey\Functions\when( 'current_user_can' )->justReturn( false );

		$this->availability_checker->expects( 'is_installed' )
			->times( $times_check_installed )
			->andReturn( ...$is_installed );

		Monkey\Functions\when( 'get_current_user_id' )->justReturn( 1 );

		$this->notification_center->expects( 'add_notification' )
			->times( $times_add_notification );

		$this->notification_center->expects( 'remove_notification_by_id' )
			->times( $times_remove_notification );

		$this->instance->add_notifications();
	}

	/**
	 * The dataProvider for the test_override_error_messages test case.
	 *
	 * @return array<int, array<string, array<string, bool>>>
	 */
	public function data_add_notifications(): array {
		$installed_woo_plugin_with_dependency = [
			'yoast-woocommerce-seo' => [
				'url'           => 'https://yoa.st/1o0',
				'title'         => 'Yoast WooCommerce SEO',
				'_dependencies' => [
					'WooCommerce' => [
						'conditional' => new WooCommerce_Conditional(),
					],
				],
				'installed'     => true,
				'slug'          => 'wpseo-woocommerce/wpseo-woocommerce.php',
			],
		];

		$not_installed_woo_plugin_with_dependency                                       = $installed_woo_plugin_with_dependency;
		$not_installed_woo_plugin_with_dependency['yoast-woocommerce-seo']['installed'] = false;

		$installed_random_plugin_with_dependency = [
			'yoast-random-seo' => [
				'url'           => 'https://yoa.st/rNd',
				'title'         => 'Yoast Random SEO',
				'_dependencies' => [
					'Random Dependency (eg. Elementor)' => [
						'conditional' => new Elementor_Activated_Conditional(),
					],
				],
				'installed'     => true,
				'slug'          => 'wpseo-random/wpseo-random.php',
			],
		];

		$not_installed_random_plugin_with_dependency                                  = $installed_random_plugin_with_dependency;
		$not_installed_random_plugin_with_dependency['yoast-random-seo']['installed'] = false;

		return [
			'No plugins with dependencies' => [
				'plugins_with_dependencies' => [],
				'satisfied_dependencies'    => [],
				'times_check_installed'     => 0,
				'is_installed'              => [],
				'times_add_notification'    => 0,
				'times_remove_notification' => 0,
			],
			'One installed and active plugin with dependency and the dependency is satisfied' => [
				'plugins_with_dependencies' => $installed_woo_plugin_with_dependency,
				'satisfied_dependencies'    => [ true ],
				'times_check_installed'     => 1,
				'is_installed'              => [ true ],
				'times_add_notification'    => 0,
				'times_remove_notification' => 1,
			],
			'One not installed plugin with dependency and the dependency is satisfied' => [
				'plugins_with_dependencies' => $not_installed_woo_plugin_with_dependency,
				'satisfied_dependencies'    => [ true ],
				'times_check_installed'     => 1,
				'is_installed'              => [ false ],
				'times_add_notification'    => 1,
				'times_remove_notification' => 0,
			],
			'One plugin with dependency and the dependency is not satisfied' => [
				'plugins_with_dependencies' => $installed_woo_plugin_with_dependency,
				'satisfied_dependencies'    => [ false ],
				'times_check_installed'     => 0,
				'is_installed'              => [],
				'times_add_notification'    => 0,
				'times_remove_notification' => 1,
			],
			'Two installed plugins with dependencies and both dependencies are satisfied' => [
				'plugins_with_dependencies' => \array_merge( $installed_woo_plugin_with_dependency, $installed_random_plugin_with_dependency ),
				'satisfied_dependencies'    => [ true ],
				'times_check_installed'     => 2,
				'is_installed'              => [ true ],
				'times_add_notification'    => 0,
				'times_remove_notification' => 2,
			],
			'Two not installed plugins with dependencies and both dependencies are satisfied' => [
				'plugins_with_dependencies' => \array_merge( $not_installed_woo_plugin_with_dependency, $not_installed_random_plugin_with_dependency ),
				'satisfied_dependencies'    => [ true ],
				'times_check_installed'     => 2,
				'is_installed'              => [ false ],
				'times_add_notification'    => 2,
				'times_remove_notification' => 0,
			],
			'Two not installed plugins with dependencies and both dependencies are not satisfied' => [
				'plugins_with_dependencies' => \array_merge( $installed_woo_plugin_with_dependency, $installed_random_plugin_with_dependency ),
				'satisfied_dependencies'    => [ false ],
				'times_check_installed'     => 0,
				'is_installed'              => [],
				'times_add_notification'    => 0,
				'times_remove_notification' => 2,
			],
		];
	}
}
