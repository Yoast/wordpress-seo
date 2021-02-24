<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;

use Yoast\WP\SEO\Integrations\Watchers\Addon_Update_Watcher;


/**
 * Class Auto_Update_Watcher_Test.
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
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->instance = new Addon_Update_Watcher();
	}

	/**
	 * Tests that auto updates for add-ons are disabled when auto updates
	 * for Free are disabled.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons_on_free_auto_update_toggle
	 */
	public function test_disable_auto_updates_for_add_ons_on_free_auto_update_disable() {
		$old = [ 'other-plugin/plugin.php' ];
		$new = [ 'other-plugin/plugin.php', 'wordpress-seo/wp-seo.php' ];

		$option = [
			'other-plugin/plugin.php',
			'wordpress-seo/wp-seo.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wordpress-seo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];

		Monkey\Functions\expect( 'update_option' )
			->with( 'auto_update_plugins', $option )
			->once();

		$this->instance->toggle_auto_updates_for_add_ons_on_free_auto_update_toggle(
			$old,
			$new
		);
	}

	/**
	 * Tests that auto updates for add-ons are enabled when auto updates
	 * for Free are enabled.
	 *
	 * @covers ::toggle_auto_updates_for_add_ons_on_free_auto_update_toggle
	 */
	public function test_enable_auto_updates_for_add_ons_on_free_auto_update_enable() {
		$old = [
			'other-plugin/plugin.php',
			'wordpress-seo/wp-seo.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wordpress-seo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];
		$new = [
			'other-plugin/plugin.php',
			'wordpress-seo-premium/wp-seo-premium.php',
			'wpseo-video/video-seo.php',
			'wordpress-seo-local/local-seo.php',
			'wpseo-woocommerce/wpseo-woocommerce.php',
			'wpseo-news/wpseo-news.php',
			'yoast-acf-analysis/yoast-acf-analysis.php',
		];

		$option = [
			'other-plugin/plugin.php',
		];

		Monkey\Functions\expect( 'update_option' )
			->with( 'auto_update_plugins', $option )
			->once();

		$this->instance->toggle_auto_updates_for_add_ons_on_free_auto_update_toggle(
			$old,
			$new
		);
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
			[ 'wordpress-seo-premium/wp-seo-premium.php' ],
			[ 'wpseo-video/video-seo.php' ],
			[ 'wordpress-seo-local/local-seo.php' ],
			[ 'wpseo-woocommerce/wpseo-woocommerce.php' ],
			[ 'wpseo-news/wpseo-news.php' ],
			[ 'yoast-acf-analysis/yoast-acf-analysis.php' ],
		];
	}
}
