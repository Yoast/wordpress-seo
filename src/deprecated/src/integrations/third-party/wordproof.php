<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Helpers\Wordproof_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class WordProof
 *
 * @deprecated 22.10
 * @codeCoverageIgnore
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
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param Wordproof_Helper               $wordproof     The WordProof helper instance.
	 * @param WPSEO_Admin_Asset_Manager|null $asset_manager The WPSEO admin asset manager instance.
	 */
	public function __construct( Wordproof_Helper $wordproof, ?WPSEO_Admin_Asset_Manager $asset_manager = null ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
		if ( ! $asset_manager ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager = $asset_manager;
		$this->wordproof     = $wordproof;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
		return [];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
	}

	/**
	 * Initializes the WordProof WordPress SDK.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function sdk_setup() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
	}

	/**
	 * Removes the WordProof timestamp post meta if a legal page is changed.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param int $old_post_id The old post id.
	 * @param int $new_post_id The new post id.
	 *
	 * @return void
	 */
	public function disable_timestamp_for_previous_legal_page( $old_post_id, $new_post_id ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
	}

	/**
	 * Return the Yoast post meta key for the SDK to determine if the post should be timestamped.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param array $meta_keys The array containing meta keys that should be used.
	 * @return array
	 */
	public function add_post_meta_key( $meta_keys ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
		return [ $this->post_meta_key ];
	}

	/**
	 * Return an empty array to disable automatically timestamping selected post types.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param array $post_types The array containing post types that should be automatically timestamped.
	 * @return array
	 */
	public function wordproof_timestamp_post_types( $post_types ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
		return [];
	}

	/**
	 * This filters hides the certificate if the Yoast post meta key is not set to true.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param bool    $value If the certificate should be shown.
	 * @param WP_Post $post  The post object of the post for which to determine the certificate should be shown.
	 * @return bool|null
	 */
	public function show_certificate( $value, $post ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return null;
	}

	/**
	 * Adds the WordProof integration toggle to the array.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param array $fields The currently registered meta fields.
	 *
	 * @return array A new array with meta fields.
	 */
	public function add_meta_field( $fields ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

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
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );
	}

	/**
	 * Adds async to the wordproof-uikit script.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		if ( $handle !== WPSEO_Admin_Asset_Manager::PREFIX . 'wordproof-uikit' ) {
			return $tag;
		}

		return "<script src={$src} async></script>";
	}
}
