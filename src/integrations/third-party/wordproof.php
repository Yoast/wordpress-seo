<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WPSEO_Admin_Asset;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Integration_Active_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Config\Wordproof_App_Config;
use Yoast\WP\SEO\Config\Wordproof_Translations;
use Yoast\WP\SEO\Helpers\Wordproof_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use YoastSEO_Vendor\WordProof\SDK\Helpers\CertificateHelper;
use YoastSEO_Vendor\WordProof\SDK\Helpers\PostMetaHelper;
use YoastSEO_Vendor\WordProof\SDK\WordPressSDK;

/**
 * Class WordProof
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */
class Wordproof implements Integration_Interface {

	/**
	 * The Yoast meta key used to save if a post shiould be timestamped.
	 *
	 * @var string
	 */
	protected $post_meta_key = '_yoast_wpseo_wordproof_timestamp';

	/**
	 * The WordProof helper instance.
	 *
	 * @var Wordproof_Helper
	 */
	protected $wordproof;

	/**
	 * Asset manager instance.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The WordProof integration constructor.
	 *
	 * @param Wordproof_Helper          $wordproof     The WordProof helper instance.
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The WPSEO admin asset manager instance.
	 */
	public function __construct( Wordproof_Helper $wordproof, ?WPSEO_Admin_Asset_Manager $asset_manager = null ) {
		if ( ! $asset_manager ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager = $asset_manager;
		$this->wordproof     = $wordproof;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [
			Wordproof_Plugin_Inactive_Conditional::class,
			Non_Multisite_Conditional::class,
			Wordproof_Integration_Active_Conditional::class,
		];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		/**
		 * Used to initialize the WordProof WordPress SDK.
		 */
		\add_action( 'init', [ $this, 'sdk_setup' ], 11 );

		/**
		 * Enqueue the wordproof assets.
		 */
		\add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ], 10, 0 );

		if ( \version_compare( \strtok( \get_bloginfo( 'version' ), '-' ), '6.3', '>=' ) ) {
			\add_action(
				'wp_enqueue_scripts',
				static function () {
					\wp_script_add_data( WPSEO_Admin_Asset_Manager::PREFIX . 'wordproof-uikit', 'strategy', 'async' );
				},
				11,
				0
			);
		}
		else {
			\add_filter( 'script_loader_tag', [ $this, 'add_async_to_script' ], 10, 3 );
		}

		/**
		 * Removes the post meta timestamp key for the old privacy page.
		 */
		\add_action( 'update_option_wp_page_for_privacy_policy', [ $this, 'disable_timestamp_for_previous_legal_page' ], 10, 2 );

		/**
		 * Removes the post meta timestamp key for the old terms and conditions page.
		 */
		\add_action( 'update_option_woocommerce_terms_page_id', [ $this, 'disable_timestamp_for_previous_legal_page' ], 10, 2 );

		/**
		 * Called by the WordProof WordPress SDK to determine if the post should be timestamped.
		 */
		\add_filter( 'wordproof_timestamp_post_meta_key_overrides', [ $this, 'add_post_meta_key' ] );

		/**
		 * Called by the WordProof WordPress SDK to determine if the post should be automatically timestamped.
		 */
		\add_filter( 'wordproof_timestamp_post_types', [ $this, 'wordproof_timestamp_post_types' ] );

		/**
		 * Called by the WordProof WordPress SDK to determine if the certificate should be shown.
		 */
		\add_filter( 'wordproof_timestamp_show_certificate', [ $this, 'show_certificate' ], 10, 2 );

		/**
		 * Called by WPSEO_Meta to add extra meta fields to the ones defined there.
		 */
		\add_filter( 'add_extra_wpseo_meta_fields', [ $this, 'add_meta_field' ] );
	}

	/**
	 * Initializes the WordProof WordPress SDK.
	 *
	 * @return void
	 */
	public function sdk_setup() {

		$config       = new Wordproof_App_Config();
		$translations = new Wordproof_Translations();

		WordPressSDK::getInstance( $config, $translations )
			->certificate()
			->initialize();
	}

	/**
	 * Removes the WordProof timestamp post meta if a legal page is changed.
	 *
	 * @param int $old_post_id The old post id.
	 * @param int $new_post_id The new post id.
	 *
	 * @return void
	 */
	public function disable_timestamp_for_previous_legal_page( $old_post_id, $new_post_id ) {

		if ( $old_post_id !== $new_post_id ) {
			\delete_post_meta( $old_post_id, '_yoast_wpseo_wordproof_timestamp' );
		}
	}

	/**
	 * Return the Yoast post meta key for the SDK to determine if the post should be timestamped.
	 *
	 * @param array $meta_keys The array containing meta keys that should be used.
	 * @return array
	 */
	public function add_post_meta_key( $meta_keys ) {
		return [ $this->post_meta_key ];
	}

	/**
	 * Return an empty array to disable automatically timestamping selected post types.
	 *
	 * @param array $post_types The array containing post types that should be automatically timestamped.
	 * @return array
	 */
	public function wordproof_timestamp_post_types( $post_types ) {
		return [];
	}

	/**
	 * This filters hides the certificate if the Yoast post meta key is not set to true.
	 *
	 * @param bool    $value If the certificate should be shown.
	 * @param WP_Post $post  The post object of the post for which to determine the certificate should be shown.
	 * @return bool|null
	 */
	public function show_certificate( $value, $post ) {
		if ( ! $value ) {
			return $value;
		}

		if ( ! $this->wordproof->integration_is_active() ) {
			return false;
		}

		return \boolval( PostMetaHelper::get( $post->ID, $this->post_meta_key ) );
	}

	/**
	 * Adds the WordProof integration toggle to the array.
	 *
	 * @param array $fields The currently registered meta fields.
	 *
	 * @return array A new array with meta fields.
	 */
	public function add_meta_field( $fields ) {
		$fields['advanced']['wordproof_timestamp'] = [
			'type'          => 'hidden',
			'title'         => '',
			'default_value' => '',
			'description'   => '0',
		];

		return $fields;
	}

	/**
	 * Enqueue the uikit script.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		if ( CertificateHelper::show() ) {
			$flat_version = $this->asset_manager->flatten_version( \WPSEO_VERSION );

			/**
			 * We are using the Admin asset manager to register and enqueue a file served for all visitors,
			 * authenticated and unauthenticated users.
			 */
			$script = new WPSEO_Admin_Asset(
				[
					'name'    => 'wordproof-uikit',
					'src'     => 'wordproof-uikit.js',
					'version' => $flat_version,
				]
			);

			$this->asset_manager->register_script( $script );
			$this->asset_manager->enqueue_script( 'wordproof-uikit' );
		}
	}

	/**
	 * Adds async to the wordproof-uikit script.
	 *
	 * @param string $tag    The script tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 * @param string $src    The script's source URL.
	 *
	 * @return string The script's tag.
	 *
	 * @phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript
	 */
	public function add_async_to_script( $tag, $handle, $src ) {
		if ( $handle !== WPSEO_Admin_Asset_Manager::PREFIX . 'wordproof-uikit' ) {
			return $tag;
		}

		return "<script src={$src} async></script>";
	}
}
