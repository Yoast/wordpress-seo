<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WordProof\SDK\Helpers\PostMeta;
use WordProof\SDK\WordPressSDK;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Plugin_Inactive_Conditional;
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

	public function __construct( WordProof_Helper $wordproof ) {
		$this->wordproof = $wordproof;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		 return [ WordProof_Plugin_Inactive_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'init', [ $this, 'sdk_setup' ], 11 );
		\add_filter( 'wordproof_timestamp_post_meta_key_overrides', [ $this, 'add_post_meta_key' ] );
		\add_filter( 'wordproof_timestamp_show_certificate', [ $this, 'show_certificate' ], 10, 2 );
	}

	/**
	 * Initializes the WordProof WordPress SDK.
	 */
	public function sdk_setup() {
		WordPressSDK::getInstance( 'yoast', 'staging' )
			->certificate()
			->initialize();
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
	 * @param WP_Post $post The post object of the post for which to determine the certificate should be shown.
	 * @return bool|null
	 */
	public function show_certificate( $value, $post ) {
		if ( ! $value ) {
			return $value;
		}

		if ( ! $this->wordproof->integration_is_active() ) {
			return false;
		}

		return boolval( PostMeta::get( $post->ID, $this->post_meta_key ) );
	}
}
