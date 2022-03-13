<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WordProof\SDK\Helpers\PostMetaHelper;
use WordProof\SDK\WordPressSDK;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Config\WordProof_App_Config;
use Yoast\WP\SEO\Config\WordProof_Translations;
use Yoast\WP\SEO\Helpers\WordProof_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class WordProof
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */
class WordProof implements Integration_Interface {

	/**
	 * The Yoast meta key used to save if a post should be timestamped.
	 *
	 * @var string The Yoast meta key used to save if a post should be timestamped.
	 */
	protected $post_meta_key = '_yoast_wpseo_wordproof_timestamp';

	/**
	 * The WordProof helper instance.
	 *
	 * @var WordProof_Helper $wordproof The helper instance.
	 */
	protected $wordproof;

	/**
	 * The WordProof integration constructor.
	 *
	 * @param WordProof_Helper $wordproof The WordProof helper instance.
	 */
	public function __construct( WordProof_Helper $wordproof ) {
		$this->wordproof = $wordproof;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ WordProof_Plugin_Inactive_Conditional::class, Non_Multisite_Conditional::class ];
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
		 * Called by the WordProof WordPress SDK to determine if the certficate should be shown.
		 */
		\add_filter( 'wordproof_timestamp_show_certificate', [ $this, 'show_certificate' ], 10, 2 );

		/**
		 * Called by WPSEO_Meta to add extra meta fields to the ones defined there.
		 */
		\add_filter( 'add_extra_wpseo_meta_fields', [ $this, 'add_meta_field' ] );
	}

	/**
	 * Initializes the WordProof WordPress SDK.
	 */
	public function sdk_setup() {

		$config       = new WordProof_App_Config();
		$translations = new WordProof_Translations();

		WordPressSDK::getInstance( $config, $translations )
			->certificate()
			->initialize();
	}

	/**
	 * Removes the WordProof timestamp post meta if a legal page is changed.
	 *
	 * @param integer $old_post_id The old post id.
	 * @param integer $new_post_id The new post id.
	 */
	public function disable_timestamp_for_previous_legal_page( $old_post_id, $new_post_id ) {

		if ( $old_post_id !== $new_post_id ) {
			delete_post_meta( $old_post_id, '_yoast_wpseo_wordproof_timestamp' );
		}
	}

	/**
	 * Add the Yoast post meta key for the included WordProof SDK to determine if the post should be timestamped.
	 *
	 * @param array $array The array containing meta keys that should be used.
	 * @return array
	 */
	public function add_post_meta_key( $array ) {
		$array[] = $this->post_meta_key;
		return $array;
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

		return boolval( PostMetaHelper::get( $post->ID, $this->post_meta_key ) );
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
}
