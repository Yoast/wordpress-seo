<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Schema\Application\Configuration;

use Easy_Digital_Downloads;
use SeriouslySimplePodcasting\Integrations\Yoast\Schema\PodcastEpisode;
use TEC\Events\Integrations\Plugins\WordPress_SEO\Events_Schema;
use WP_Recipe_Maker;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;

/**
 * Responsible for the schema configuration.
 */
class Schema_Configuration {

	/**
	 * The WooCommerce helper.
	 *
	 * @var Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Schema_Configuration constructor.
	 *
	 * @param Woocommerce_Helper $woocommerce_helper The WooCommerce helper.
	 * @param Product_Helper     $product_helper     The product helper.
	 */
	public function __construct( Woocommerce_Helper $woocommerce_helper, Product_Helper $product_helper ) {
		$this->woocommerce_helper = $woocommerce_helper;
		$this->product_helper     = $product_helper;
	}

	/**
	 * Returns the schema configuration.
	 *
	 * @return array<string, bool|array<string, array<string, bool|string>>>
	 */
	public function get_configuration(): array {
		$schema_filtered_output = $this->get_filtered_schema_output();

		$configuration = [
			'isSchemaDisabled'      => ( $schema_filtered_output === [] || $schema_filtered_output === false ),
			'schemaApiIntegrations' => $this->get_schema_api_integrations(),
		];

		return $configuration;
	}

	/**
	 * Gets the schema API integrations status.
	 *
	 * @return array<string, array<string, bool|string>> The schema API integrations status.
	 */
	private function get_schema_api_integrations(): array {
		$addon_manager = new WPSEO_Addon_Manager();

		$woocommerce_seo_file      = 'wpseo-woocommerce/wpseo-woocommerce.php';
		$woocommerce_active        = $this->woocommerce_helper->is_active();
		$woocommerce_seo_active    = \is_plugin_active( $woocommerce_seo_file );
		$woocommerce_seo_installed = $addon_manager->is_installed( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG );

		$woocommerce_seo_activate_url = \wp_nonce_url(
			\self_admin_url( 'plugins.php?action=activate&plugin=' . $woocommerce_seo_file ),
			'activate-plugin_' . $woocommerce_seo_file
		);

		$is_premium = $this->product_helper->is_premium();

		return [
			'tec'             => [
				'isActive' => \class_exists( Events_Schema::class ),
			],
			'ssp'             => [
				'isActive' => \class_exists( PodcastEpisode::class ),
			],
			'wp-recipe-maker' => [
				'isActive' => \class_exists( WP_Recipe_Maker::class ),
			],
			'woocommerce'     => [
				'isPrerequisiteActive' => $woocommerce_active,
				'isActive'             => $woocommerce_seo_active,
				'isInstalled'          => $woocommerce_seo_installed,
				'activationLink'       => $woocommerce_seo_activate_url,
			],
			'edd'             => [
				'isActive'  => \class_exists( Easy_Digital_Downloads::class ),
				'isPremium' => $is_premium,
			],
		];
	}

	/**
	 * Gets the filtered schema output.
	 *
	 * @return string|array<string> The filtered schema output.
	 */
	private function get_filtered_schema_output() {
		$deprecated_data = [
			'_deprecated' => 'Please use the "wpseo_schema_*" filters to extend the Yoast SEO schema data - see the WPSEO_Schema class.',
		];

		/**
		 * Filter documented in Schema_Presenter::present().
		 */
		return \apply_filters( 'wpseo_json_ld_output', $deprecated_data, '' );
	}
}
