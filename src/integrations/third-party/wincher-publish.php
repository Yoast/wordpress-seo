<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WP_Post;
use WPSEO_Meta;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Keyphrases_Action;
use Yoast\WP\SEO\Conditionals\Wincher_Automatically_Track_Conditional;
use Yoast\WP\SEO\Conditionals\Wincher_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles automatically tracking published posts with Wincher.
 */
class Wincher_Publish implements Integration_Interface {

	/**
	 * The Wincher enabled conditional.
	 *
	 * @var Wincher_Enabled_Conditional
	 */
	protected $wincher_enabled;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The Wincher keyphrases action handler.
	 *
	 * @var Wincher_Keyphrases_Action
	 */
	protected $keyphrases_action;

	/**
	 * Wincher publish constructor.
	 *
	 * @param Wincher_Enabled_Conditional $wincher_enabled   The WPML WPSEO conditional.
	 * @param Options_Helper              $options_helper    The options helper.
	 * @param Wincher_Keyphrases_Action   $keyphrases_action The keyphrases action class.
	 */
	public function __construct(
		Wincher_Enabled_Conditional $wincher_enabled,
		Options_Helper $options_helper,
		Wincher_Keyphrases_Action $keyphrases_action
	) {
		$this->wincher_enabled = $wincher_enabled;
		$this->options_helper  = $options_helper;
		$this->keyphrases_action = $keyphrases_action;
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		/**
		 * Called in the REST API when submitting the post copy in the Block Editor.
		 * Runs the republishing of the copy onto the original.
		 */
		\add_action( 'rest_after_insert_post', [ $this, 'track_after_rest_api_request' ] );

		/**
		 * Called by `wp_insert_post()` when submitting the post copy, which runs in two cases:
		 * - In the Classic Editor, where there's only one request that updates everything.
		 * - In the Block Editor, only when there are custom meta boxes.
		 */
		\add_action( 'wp_insert_post', [ $this, 'track_after_post_request' ], \PHP_INT_MAX, 2 );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * This integration should only be active when WPML is installed and activated.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Wincher_Enabled_Conditional::class, Wincher_Automatically_Track_Conditional::class ];
	}

	/**
	 * Checks whether a request is the Classic Editor POST request.
	 *
	 * @return bool Whether the request is the Classic Editor POST request.
	 */
	public function is_classic_editor_post_request() {
		if ( $this->is_rest_request() || \wp_doing_ajax() ) {
			return false;
		}

		return isset( $_GET['meta-box-loader'] ) === false;
	}

	/**
	 * Determines whether the current request is a REST request.
	 *
	 * @return bool Whether the request is a REST request.
	 */
	public function is_rest_request() {
		return \defined( 'REST_REQUEST' ) && \REST_REQUEST;
	}

	/**
	 * Sends the keyphrases associated with the post to Wincher for automatic tracking.
	 *
	 * @param WP_Post $post The post to extract the keyphrases from.
	 *
	 * @return void
	 */
	public function track_request( $post ) {
		if ( ! $post instanceof \WP_Post ) {
			return;
		}

		$keyphrases   = [];
		$keyphrases[] = WPSEO_Meta::get_value( 'focuskw', $post->ID );

		if ( YoastSEO()->helpers->product->is_premium() ) {
			$additional_keywords = json_decode( WPSEO_Meta::get_value( 'focuskeywords', $post->ID ), true );
			$keyphrases = array_merge( $keyphrases, $additional_keywords );
		}

		// Filter out empty entries.
		$keyphrases = \array_filter( $keyphrases );

		if ( ! empty( $keyphrases ) ) {
			$this->keyphrases_action->track_keyphrases( $keyphrases );
		}
	}

	/**
	 * Republishes the original post with the passed post, when using the Block Editor.
	 *
	 * @param WP_Post $post The copy's post object.
	 *
	 * @return void
	 */
	public function track_after_rest_api_request( $post ) {
		$this->track_request( $post );
	}

	/**
	 * Republishes the original post with the passed post, when using the Classic Editor.
	 *
	 * Runs also in the Block Editor to save the custom meta data only when there
	 * are custom meta boxes.
	 *
	 * @param int     $post_id The copy's post ID.
	 * @param WP_Post $post    The copy's post object.
	 *
	 * @return void
	 */
	public function track_after_post_request( $post_id, $post ) {
		if ( $this->is_rest_request() ) {
			return;
		}

		$this->track_request( $post );
	}
}
