<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Addon_Update_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher
 */
final class Addon_Update_Watcher_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Addon_Update_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->instance = new Addon_Update_Watcher();
	}

	/**
	 * Tests that the right methods are hooked into the right hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'add_site_option_auto_update_plugins' )
			->with( [ $this->instance, 'call_toggle_auto_updates_with_empty_array' ] )
			->once();

		Monkey\Actions\expectAdded( 'update_site_option_auto_update_plugins' )
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
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		self::assertEquals( [ Admin_Conditional::class ], Addon_Update_Watcher::get_conditionals() );
	}

	/**
	 * Tests that add-on auto-updates are enabled when the `auto_update_plugins` option didn't previously exist.
	 *
	 * @covers ::call_toggle_auto_updates_with_empty_array
	 *
	 * @return void
	 */
	public function test_auto_update_plugins_option_did_not_exist() {
		$plugins = [
			'wordpress-seo/wp-seo.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'acf-content-analysis-for-yoast-seo/yoast-acf-analysis.php',
		];

		Monkey\Functions\expect( 'update_site_option' )
			->once()
			->with( 'auto_update_plugins', $plugins )
			->andReturn( true );

		$this->instance->call_toggle_auto_updates_with_empty_array( 'auto_update_plugins', [ 'wordpress-seo/wp-seo.php' ] );
	}

	/**
	 * Tests that nothing happens when the old value of the `auto_update_plugins` option is not an array.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 *
	 * @return void
	 */
	public function test_do_not_toggle_when_old_value_not_array() {
		Monkey\Functions\expect( 'update_site_option' )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons( 'auto_update_plugins', [ 'the_new_value' ], 'the old value' );
	}

	/**
	 * Tests that nothing happens when the new value of the `auto_update_plugins` option is not an array.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 *
	 * @return void
	 */
	public function test_do_not_toggle_when_new_value_not_array() {
		Monkey\Functions\expect( 'update_site_option' )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons( 'auto_update_plugins', 'the_new_value', [ 'the old value' ] );
	}

	/**
	 * Tests that nothing happens when the option is not 'auto_update_plugins'.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 *
	 * @return void
	 */
	public function test_do_not_toggle_when_option_has_unexpected_value() {
		Monkey\Functions\expect( 'update_site_option' )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons( 'another_option', [ 'the_new_value' ], [ 'the old value' ] );
	}

	/**
	 * Tests that auto updates for add-ons are enabled when auto updates
	 * for Free are enabled.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 * @covers ::are_auto_updates_enabled
	 * @covers ::disable_auto_updates_for_addons
	 * @covers ::enable_auto_updates_for_addons
	 *
	 * @return void
	 */
	public function test_enable_auto_updates_for_add_ons_on_free_auto_update_enabled() {
		$old = [ 'other-plugin/plugin.php' ];
		$new = [ 'other-plugin/plugin.php', 'wordpress-seo/wp-seo.php' ];

		$plugins = [
			'other-plugin/plugin.php',
			'wordpress-seo/wp-seo.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wpseo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'acf-content-analysis-for-yoast-seo/yoast-acf-analysis.php',
		];

		Monkey\Functions\expect( 'update_site_option' )
			->once()
			->with( 'auto_update_plugins', $plugins )
			->andReturn( true );

		$this->instance->toggle_auto_updates_for_add_ons(
			'auto_update_plugins',
			$new,
			$old
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
	 *
	 * @return void
	 */
	public function test_disable_auto_updates_for_add_ons_on_free_auto_update_disable() {
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

		$plugins = [
			'other-plugin/plugin.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];

		Monkey\Functions\expect( 'update_site_option' )
			->once()
			->with( 'auto_update_plugins', $plugins );

		$this->instance->toggle_auto_updates_for_add_ons(
			'auto_update_plugins',
			$new,
			$old
		);
	}

	/**
	 * Tests that nothing happens when auto updates are toggled for a plugin other than Yoast SEO.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons
	 * @covers ::are_auto_updates_enabled
	 * @covers ::enable_auto_updates_for_addons
	 * @covers ::disable_auto_updates_for_addons
	 *
	 * @return void
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

		$plugins = [
			'other-plugin/plugin.php',
		];

		Monkey\Functions\expect( 'update_site_option' )
			->with( 'auto_update_plugins', $plugins )
			->never();

		$this->instance->toggle_auto_updates_for_add_ons(
			'auto_update_plugins',
			$new,
			$old
		);
	}

	/**
	 * Tests whether the replace_auto_update_toggles_of_addons function is
	 * exited early when $old_html is not a string.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 *
	 * @return void
	 */
	public function test_html_not_replaced_when_html_not_string() {
		$old_html = 123;

		Monkey\Functions\expect( 'get_site_option' )
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
	 *
	 * @return void
	 */
	public function test_html_not_replaced_when_auto_updated_plugins_does_not_exist() {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
			->with( 'auto_update_plugins' )
			->andReturn( false );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			'wordpress-seo-premium/wp-seo-premium.php'
		);

		self::assertEquals( '<em>Auto-updates are disabled based on this setting for Yoast SEO.</em>', $new_html );
	}

	/**
	 * Tests whether the replace_auto_update_toggles_of_addons function is
	 * exited early when $auto_updates_plugins is not an array.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 *
	 * @return void
	 */
	public function test_html_not_replaced_when_auto_updated_plugins_not_an_array() {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
			->with( 'auto_update_plugins' )
			->andReturn( 'the_plugin_as_string' );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			'wordpress-seo-premium/wp-seo-premium.php'
		);

		self::assertEquals( '<em>Auto-updates are disabled based on this setting for Yoast SEO.</em>', $new_html );
	}

	/**
	 * Tests the replacement of the auto-update toggles with the text
	 * 'Auto-updates are enabled based on this setting for Yoast SEO.'
	 * when auto-updates for WordPress SEO are enabled.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 *
	 * @return void
	 */
	public function test_do_not_replace_auto_update_toggles_from_other_plugins() {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
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
	 * @dataProvider plugin_provider
	 *
	 * @param string $plugin The plugin string to test.
	 *
	 * @return void
	 */
	public function test_replace_auto_update_toggles_from_addons_with_enabled_text( $plugin ) {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
			->with( 'auto_update_plugins' )
			->andReturn( [ 'wordpress-seo/wp-seo.php' ] );

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
	 * @covers ::are_auto_updates_enabled
	 *
	 * @dataProvider plugin_provider
	 *
	 * @param string $plugin The plugin string to test.
	 *
	 * @return void
	 */
	public function test_replace_auto_update_toggles_from_addons_with_disabled_text( $plugin ) {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
			->with( 'auto_update_plugins' )
			->andReturn( [] );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			$plugin
		);

		self::assertEquals( '<em>Auto-updates are disabled based on this setting for Yoast SEO.</em>', $new_html );
	}

	/**
	 * Tests the replacement of the auto-update toggles with the text
	 * 'Auto-updates are disabled based on this setting for Yoast SEO.'
	 * when the 'auto_update_plugins' database option returns false.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 * @covers ::are_auto_updates_enabled
	 *
	 * @dataProvider plugin_provider
	 *
	 * @param string $plugin The plugin string to test.
	 *
	 * @return void
	 */
	public function test_replace_auto_update_toggles_from_addons_when_enabled_plugins_false( $plugin ) {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
			->with( 'auto_update_plugins' )
			->andReturn( false );

		$new_html = $this->instance->replace_auto_update_toggles_of_addons(
			$old_html,
			$plugin
		);

		self::assertEquals( '<em>Auto-updates are disabled based on this setting for Yoast SEO.</em>', $new_html );
	}

	/**
	 * Tests the replacement of the auto-update toggles with the text
	 * 'Auto-updates are disabled based on this setting for Yoast SEO.'
	 * when the 'auto_update_plugins' database option does not return an array.
	 *
	 * @covers ::replace_auto_update_toggles_of_addons
	 * @covers ::are_auto_updates_enabled
	 *
	 * @dataProvider plugin_provider
	 *
	 * @param string $plugin The plugin string to test.
	 *
	 * @return void
	 */
	public function test_replace_auto_update_toggles_from_addons_when_enabled_plugins_not_an_array( $plugin ) {
		$old_html = 'old_html';

		Monkey\Functions\expect( 'get_site_option' )
			->with( 'auto_update_plugins' )
			->andReturn( 'a string' );

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
	public static function plugin_provider() {
		return [
			[ 'wordpress-seo-premium/wp-seo-premium.php' ],
			[ 'wpseo-video/video-seo.php' ],
			[ 'wpseo-local/local-seo.php' ],
			[ 'wpseo-woocommerce/wpseo-woocommerce.php' ],
			[ 'wpseo-news/wpseo-news.php' ],
		];
	}
}
