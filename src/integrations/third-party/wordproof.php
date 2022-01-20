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

	/**
	 * The WordProof integration constructor.
	 *
	 * WordProof constructor.
	 * @param WordProof_Helper $wordproof The WordProof helper instance
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
		/**
		 * Used to initialize the WordProof WordPress SDK.
		 */
		\add_action( 'init', [ $this, 'sdk_setup' ], 11 );

		/**
		 * Called by the WordProof WordPress SDK to determine if the post should be timestamped.
		 */
		\add_filter( 'wordproof_timestamp_post_meta_key_overrides', [ $this, 'add_post_meta_key' ] );

		/**
		 * Called by the WordProof WordPress SDK to determine if the certficate should be shown.
		 */
		\add_filter( 'wordproof_timestamp_show_certificate', [ $this, 'show_certificate' ], 10, 2 );

		/**
		 * Called by Yoast_Integration_Toggles to add extra toggles to the ones defined there.
		 */
		\add_filter( 'wpseo_integration_toggles', [ $this, 'add_integration_toggle' ] );
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

	/**
	 * Adds the WordProof integration toggle to the array.
	 *
	 * @param array $integration_toggles The integration toggles array.
	 *
	 * @return array The updated integration toggles array.
	 */
	public function add_integration_toggle( $integration_toggles ) {
		if ( \is_array( $integration_toggles ) ) {
			$integration_toggles[] = (object) [
				/* translators: %s expands to WordProof */
				'name'            => sprintf( __( '%s integration', 'wordpress-seo' ), 'WordProof' ),
				'setting'         => 'wordproof_integration_active',
				'label'           => sprintf(
				/* translators: %s expands to WordProof */
					__( '%1$s can be used to timestamp your privacy page.', 'wordpress-seo' ),
					'WordProof'
				),
				/* translators: %s expands to WordProof */
				'read_more_label' => sprintf( __( 'Read more about how %s works.', 'wordpress-seo' ), 'WordProof ' ),
				'read_more_url'   => 'https://yoa.st/wordproof-integration',
				'order'           => 16,
			];
		}

		return $integration_toggles;
	}
}
