<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Mockery;
use Brain\Monkey;

use Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher;

/**
 * Class Addon_Update_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher
 */
class Addon_Update_Watcher_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Addon_Update_Watcher
	 */
	protected $instance;

	/**
	 * Mocked product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->product_helper = Mockery::mock( Product_Helper::class );

		$this->instance = new Addon_Update_Watcher( $this->product_helper );
	}

	/**
	 * Tests that the right methods are hooked into the right hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'update_option_auto_update_plugins' )
			->with( [ $this->instance, 'toggle_auto_updates_for_add_ons' ] )
			->once();

		Monkey\Filters\expectAdded( 'plugin_auto_update_setting_html' )
			->with( [ $this->instance, 'replace_auto_update_toggles_of_addons' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that the integration is loaded under the right conditions.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		self::assertEquals( [ Admin_Conditional::class ], Addon_Update_Watcher::get_conditionals() );
	}

	/**
	 * Tests that nothing happens when the old value of the `auto_update_plugins` option is not an array.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 */
	public function test_do_not_toggle_when_old_value_not_array() {
		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons( 'the old value', [ 'the_new_value' ] );
	}

	/**
	 * Tests that nothing happens when the new value of the `auto_update_plugins` option is not an array.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 */
	public function test_do_not_toggle_when_new_value_not_array() {
		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons( [ 'the old value' ], 'the_new_value' );
	}

	/**
	 * Tests that auto updates for add-ons are disabled when auto updates
	 * for Free are disabled.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 * @covers ::are_auto_updates_enabled
	 * @covers ::disable_auto_updates_for_addons
	 * @covers ::enable_auto_updates_for_addons
	 */
	public function test_disable_auto_updates_for_add_ons_on_free_auto_update_disable() {
		$old = [ 'other-plugin/plugin.php' ];
		$new = [ 'other-plugin/plugin.php', 'wordpress-seo/wp-seo.php' ];

		$option = [
			'other-plugin/plugin.php',
			'wordpress-seo/wp-seo.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		Monkey\Functions\expect( 'update_option' )
			->with( 'auto_update_plugins', $option )
			->once();

		$this->instance->toggle_auto_updates_for_add_ons(
			$old,
			$new
		);
	}

	/**
	 * Tests that auto updates for add-ons are enabled when auto updates
	 * for Free are enabled.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 * @covers ::are_auto_updates_enabled
	 * @covers ::enable_auto_updates_for_addons
	 * @covers ::disable_auto_updates_for_addons
	 */
	public function test_enable_auto_updates_for_add_ons_on_free_auto_update_enable() {
		$old = [
			'other-plugin/plugin.php',
			'wordpress-seo/wp-seo.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];
		$new = [
			'other-plugin/plugin.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];

		$option = [
			'other-plugin/plugin.php',
		];

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		Monkey\Functions\expect( 'update_option' )
			->with( 'auto_update_plugins', $option )
			->once();

		$this->instance->toggle_auto_updates_for_add_ons(
			$old,
			$new
		);
	}

	/**
	 * Tests that auto updates for add-ons are enabled when auto updates
	 * for Free are enabled.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 * @covers ::are_auto_updates_enabled
	 * @covers ::enable_auto_updates_for_addons
	 * @covers ::disable_auto_updates_for_addons
	 */
	public function test_do_nothing_for_add_ons_when_nothing_happens_to_free_auto_update() {
		$old = [
			'other-plugin/plugin.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];
		$new = [
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];

		$option = [
			'other-plugin/plugin.php',
		];

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		Monkey\Functions\expect( 'update_option' )
			->with( 'auto_update_plugins', $option )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons(
			$old,
			$new
		);
	}

	/**
	 * Tests whether the replace_auto_update_toggles_of_addons function is
	 * exited early when $old_html is not a string.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 */
	public function test_html_not_replaced_when_html_not_string() {
		$old_html = 123;

		Monkey\Functions\expect( 'get_option' )
			->never();

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			'other-plugin/plugin-file.php'
		);

		self::assertEquals( $old_html, $new_html );
	}

	/**
	 * Tests whether the replace_auto_update_toggles_of_addons function is
	 * exited early when $auto_updates_plugins does not exist.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 */
	public function test_html_not_replaced_when_auto_updated_plugins_does_not_exist() {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->andReturn( false );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			'wordpress-seo-premium/wp-seo-premium.php'
		);

		self::assertEquals( $old_html, $new_html );
	}

	/**
	 * Tests whether the replace_auto_update_toggles_of_addons function is
	 * exited early when $auto_updates_plugins is not an array.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 */
	public function test_html_not_replaced_when_auto_updated_plugins_not_an_array() {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->andReturn( 'the_plugin_as_string' );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			'wordpress-seo-premium/wp-seo-premium.php'
		);

		self::assertEquals( $old_html, $new_html );
	}

	/**
	 * Tests the replacement of the auto-update toggles with the text
	 * 'Auto-updates are enabled based on this setting for Yoast SEO.'
	 * when auto-updates for WordPress SEO are enabled.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 */
	public function test_do_not_replace_auto_update_toggles_from_other_plugins() {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->andReturn( [ 'wordpress-seo/wp-seo.php' ] );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			'other-plugin/plugin-file.php'
		);

		self::assertEquals( $old_html, $new_html );
	}

	/**
	 * Tests the replacement of the auto-update toggles with the text
	 * 'Auto-updates are enabled based on this setting for Yoast SEO.'
	 * when auto-updates for WordPress SEO are enabled.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 *
	 * @param string $plugin The plugin string to test.
	 *
	 * @dataProvider plugin_provider
	 */
	public function test_replace_auto_update_toggles_from_addons_with_enabled_text( $plugin ) {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->andReturn( [ 'wordpress-seo/wp-seo.php' ] );

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		$this->product_helper
			->expects( 'get_product_name' )
			->andReturn( 'Yoast SEO' );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			$plugin
		);

		self::assertEquals( '<em>Auto-updates are enabled based on this setting for Yoast SEO.</em>', $new_html );
	}

	/**
	 * Tests the replacement of the auto-update toggles with the text
	 * 'Auto-updates are disabled based on this setting for Yoast SEO.'
	 * when auto-updates for WordPress SEO are disabled.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 *
	 * @param string $plugin The plugin string to test.
	 *
	 * @dataProvider plugin_provider
	 */
	public function test_replace_auto_update_toggles_from_addons_with_disabled_text( $plugin ) {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_option' )
			->with( 'auto_update_plugins' )
			->andReturn( [] );

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		$this->product_helper
			->expects( 'get_product_name' )
			->andReturn( 'Yoast SEO' );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			$plugin
		);

		self::assertEquals( '<em>Auto-updates are disabled based on this setting for Yoast SEO.</em>', $new_html );
	}

	/**
	 * Data provider for tests.
	 *
	 * @return string[][] The data.
	 */
	public function plugin_provider() {
		return [
			[ 'wpseo-video/video-seo.php' ],
			[ 'wpseo-local/local-seo.php' ],
			[ 'wpseo-woocommerce/wpseo-woocommerce.php' ],
			[ 'wpseo-news/wpseo-news.php' ],
		];
	}
}
