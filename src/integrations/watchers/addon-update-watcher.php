<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Enables Yoast add-on auto updates when Yoast SEO (Premium) is enabled and the other way around.
 *
 * Also removes the auto-update toggles from the Yoast SEO add-ons.
 */
class Addon_Update_Watcher implements Integration_Interface {

	/**
	 * ID string used by WordPress to identify the Yoast SEO plugin.
	 *
	 * @var string
	 */
	const WPSEO_FREE_PLUGIN_ID = 'wordpress-seo/wp-seo.php';

	/**
	 * ID string used by WordPress to identify the Yoast SEO Premium plugin.
	 *
	 * @var string
	 */
	const WPSEO_PREMIUM_PLUGIN_ID = 'wordpress-seo-premium/wp-seo-premium.php';

	/**
	 * A list of Yoast add-on identifiers.
	 *
	 * @var string[]
	 */
	const ADD_ONS = [
		'wpseo-video/video-seo.php',
		'wpseo-local/local-seo.php',
		'wpseo-woocommerce/wpseo-woocommerce.php',
		'wpseo-news/wpseo-news.php',
	];

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * Enables Yoast add-on auto updates when Yoast SEO (Premium) is enabled and the other way around.
	 *
	 * Also removes the auto-update toggles from the Yoast SEO add-ons.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct( Product_Helper $product_helper ) {
		$this->product_helper = $product_helper;
	}

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		\add_action(
			'update_option_auto_update_plugins',
			[
				$this,
				'toggle_auto_updates_for_add_ons',
			],
			10,
			2
		);
		\add_filter( 'plugin_auto_update_setting_html', [ $this, 'replace_auto_update_toggles_of_addons' ], 10, 2 );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Replaces the auto-update toggle links for the Yoast add-ons
	 * with a text explaining that toggling the Yoast SEO auto-update setting
	 * automatically toggles the one for the setting for the add-ons as well.
	 *
	 * @param string $old_html The old HTML.
	 * @param string $plugin   The plugin.
	 *
	 * @return string The new HTML, with the auto-update toggle link replaced.
	 */
	public function replace_auto_update_toggles_of_addons( $old_html, $plugin ) {
		if ( ! \is_string( $old_html ) ) {
			return $old_html;
		}

		$not_a_yoast_addon = ! \in_array( $plugin, self::ADD_ONS, true );

		if ( $not_a_yoast_addon ) {
			return $old_html;
		}

		$auto_updated_plugins = \get_option( 'auto_update_plugins' );

		if ( $this->are_auto_updates_enabled( $this->get_plugin_id(), $auto_updated_plugins ) ) {
			return \sprintf(
				'<em>%s</em>',
				\sprintf(
					/* Translators: %1$s resolves to Yoast SEO. */
					\esc_html__( 'Auto-updates are enabled based on this setting for %1$s.', 'wordpress-seo' ),
					$this->product_helper->get_product_name()
				)
			);
		}

		return \sprintf(
			'<em>%s</em>',
			\sprintf(
				/* Translators: %1$s resolves to Yoast SEO. */
				\esc_html__( 'Auto-updates are disabled based on this setting for %1$s.', 'wordpress-seo' ),
				$this->product_helper->get_product_name()
			)
		);
	}

	/**
	 * Enables premium auto updates when free are enabled and the other way around.
	 *
	 * @param array $old_value The old value of the `auto_update_plugins` option.
	 * @param array $new_value The new value of the `auto_update_plugins` option.
	 *
	 * @return void
	 */
	public function toggle_auto_updates_for_add_ons( $old_value, $new_value ) {
		if ( ! \is_array( $old_value ) || ! \is_array( $new_value ) ) {
			return;
		}

		$yoast_plugin_id = $this->get_plugin_id();

		$auto_updates_are_enabled  = $this->are_auto_updates_enabled( $yoast_plugin_id, $new_value );
		$auto_updates_were_enabled = $this->are_auto_updates_enabled( $yoast_plugin_id, $old_value );

		if ( $auto_updates_are_enabled === $auto_updates_were_enabled ) {
			// Auto-updates for Yoast SEO have stayed the same, so have neither been enabled or disabled.
			return;
		}

		$auto_updates_have_been_enabled = $auto_updates_are_enabled && ! $auto_updates_were_enabled;

		if ( $auto_updates_have_been_enabled ) {
			$this->enable_auto_updates_for_addons( $new_value );

			return;
		}

		$this->disable_auto_updates_for_addons( $new_value );
	}

	/**
	 * Get the ID of the currently installed Yoast SEO (Premium) plugin.
	 *
	 * @return string The plugin ID.
	 */
	protected function get_plugin_id() {
		if ( $this->product_helper->is_premium() ) {
			return self::WPSEO_PREMIUM_PLUGIN_ID;
		}
		return self::WPSEO_FREE_PLUGIN_ID;
	}

	/**
	 * Enables auto-updates for all addons.
	 *
	 * @param string[] $auto_updated_plugins The current list of auto-updated plugins.
	 */
	protected function enable_auto_updates_for_addons( $auto_updated_plugins ) {
		\update_option( 'auto_update_plugins', \array_merge( $auto_updated_plugins, self::ADD_ONS ) );
	}

	/**
	 * Disables auto-updates for all addons.
	 *
	 * @param string[] $auto_updated_plugins The current list of auto-updated plugins.
	 */
	protected function disable_auto_updates_for_addons( $auto_updated_plugins ) {
		\update_option( 'auto_update_plugins', \array_diff( $auto_updated_plugins, self::ADD_ONS ) );
	}

	/**
	 * Checks whether auto updates for a plugin are enabled.
	 *
	 * @param string $plugin_id            The plugin ID.
	 * @param array  $auto_updated_plugins The array of auto updated plugins.
	 *
	 * @return bool Whether auto updates for a plugin are enabled.
	 */
	protected function are_auto_updates_enabled( $plugin_id, $auto_updated_plugins ) {
		if ( $auto_updated_plugins === false ) {
			return false;
		}
		return \in_array( $plugin_id, $auto_updated_plugins, true );
	}
}
