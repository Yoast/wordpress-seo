<?php

namespace Yoast\WP\SEO\Content_Type_Visibility\User_Interface;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Class Needs_Review_Dismiss_Route.
 */
class Needs_Review_Dismiss_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents the alerts route prefix.
	 *
	 * @var string
	 */
	const ROUTE_PREFIX = 'needs-review';

	/**
	 * Represents post type dismiss route.
	 *
	 * @var string
	 */
	const POST_TYPE_DISMISS_ROUTE = self::ROUTE_PREFIX . '/dismiss-post-type';

	/**
	 * Represents taxonomy dismiss route.
	 *
	 * @var string
	 */
	const TAXONOMY_DISMISS_ROUTE = self::ROUTE_PREFIX . '/dismiss-taxonomy';


	/**
	 * Represents new content dismiss route.
	 *
	 * @var string
	 */
	const NEW_CONTENT_DISMISS_ROUTE = self::ROUTE_PREFIX . '/dismiss-notification';

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Constructs Needs_Review_Dismiss_Route.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$post_type_dismiss_route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'post_type_dismiss' ],
			'permission_callback' => [ $this, 'can_dismiss' ],
			'args'                => [
				'postTypeName' => [
					'validate_callback' => function( $param, $request, $key ) {
						return post_type_exists( $param );
					},
				],
			],
		];

		$taxonomy_dismiss_route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'taxonomy_dismiss' ],
			'permission_callback' => [ $this, 'can_dismiss' ],
			'args'                => [
				'taxonomyName' => [
					'validate_callback' => function( $param, $request, $key ) {
						return taxonomy_exists( $param );
					},
				],
			],
		];

		$dismiss_new_content_route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this, 'new_content_dismiss' ],
			'permission_callback' => [ $this, 'can_dismiss' ],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::POST_TYPE_DISMISS_ROUTE, $post_type_dismiss_route_args );
		\register_rest_route( Main::API_V1_NAMESPACE, self::TAXONOMY_DISMISS_ROUTE, $taxonomy_dismiss_route_args );
		\register_rest_route( Main::API_V1_NAMESPACE, self::NEW_CONTENT_DISMISS_ROUTE, $dismiss_new_content_route_args );
	}

	/**
	 * Dismisses an alert.
	 *
	 * @param WP_REST_Request $request The request. This request should have a key param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function post_type_dismiss( WP_REST_Request $request ) {
		// See if post types that needs review were removed and update option.
		$post_types_needs_review = $this->options->get( 'new_post_types', [] );
		$taxonomies_needs_review = $this->options->get( 'new_taxonomies', [] );
		$name                    = $request['postTypeName'];
		$new_needs_review        = \array_diff( $post_types_needs_review, [ $request['postTypeName'] ] );
		if ( count( $new_needs_review ) !== count( $post_types_needs_review ) ) {
			$success = $this->options->set( 'new_post_types', $new_needs_review );
			if ( ! $new_needs_review && ! $taxonomies_needs_review ) {
				$this->dismiss_notification();
			}
		}

		$status = $success === ( true ) ? 200 : 400;

		return new WP_REST_Response(
			(object) [
				'success' => $success,
				'status'  => $status,
			],
			$status
		);
	}

	/**
	 * Dismisses an alert.
	 *
	 * @param WP_REST_Request $request The request. This request should have a key param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function taxonomy_dismiss( WP_REST_Request $request ) {
		// See if post types that needs review were removed and update option.
		$post_types_needs_review = $this->options->get( 'new_post_types', [] );
		$taxonomies_needs_review = $this->options->get( 'new_taxonomies', [] );
		$new_needs_review        = \array_diff( $taxonomies_needs_review, [ $request['taxonomyName'] ] );
		if ( count( $new_needs_review ) !== count( $taxonomies_needs_review ) ) {
			$success = $this->options->set( 'new_taxonomies', $new_needs_review );
			if ( ! $post_types_needs_review && ! $new_needs_review ) {
				$this->dismiss_notification();
			}
		}

		$status = $success === ( true ) ? 200 : 400;

		return new WP_REST_Response(
			(object) [
				'success' => $success,
				'status'  => $status,
			],
			$status
		);
	}

	/**
	 * Whether or not the current user is allowed to dismiss alerts.
	 *
	 * @return bool Whether or not the current user is allowed to dismiss alerts.
	 */
	public function can_dismiss() {
		return \current_user_can( 'edit_posts' );
	}

	/**
	 * Dismisses the notification in the notification center.
	 *
	 * @return void
	 */
	public function dismiss_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'content-types-made-public' );
	}

	/**
	 * Dismisses an the JS notification on settings page.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function new_content_dismiss() {
		$success = $this->options->set( 'is_new_content_type', false );
		$status  = $success === ( true ) ? 200 : 400;

		return new WP_REST_Response(
			(object) [
				'success' => $success,
				'status'  => $status,
			],
			$status
		);
	}
}
