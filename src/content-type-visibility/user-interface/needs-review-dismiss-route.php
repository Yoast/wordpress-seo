<?php

namespace Yoast\WP\SEO\Content_Type_Visibility\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;

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
	 * @var Content_Type_Visibility_Dismiss_Notifications
	 */
	private $dismiss_notifications;

	/**
	 * Constructs Needs_Review_Dismiss_Route.
	 *
	 * @param Content_Type_Visibility_Dismiss_Notifications $dismiss_notifications The options helper.
	 */
	public function __construct( Content_Type_Visibility_Dismiss_Notifications $dismiss_notifications ) {
		$this->dismiss_notifications = $dismiss_notifications;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$post_type_dismiss_route_args = [
			'methods'             => 'POST',
			'callback'            => [ $this->dismiss_notifications, 'post_type_dismiss' ],
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
			'callback'            => [ $this->dismiss_notifications, 'taxonomy_dismiss' ],
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
			'callback'            => [ $this->dismiss_notifications, 'new_content_dismiss' ],
			'permission_callback' => [ $this, 'can_dismiss' ],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::POST_TYPE_DISMISS_ROUTE, $post_type_dismiss_route_args );
		\register_rest_route( Main::API_V1_NAMESPACE, self::TAXONOMY_DISMISS_ROUTE, $taxonomy_dismiss_route_args );
		\register_rest_route( Main::API_V1_NAMESPACE, self::NEW_CONTENT_DISMISS_ROUTE, $dismiss_new_content_route_args );
	}

	/**
	 * Whether or not the current user is allowed to dismiss alerts.
	 *
	 * @return bool Whether or not the current user is allowed to dismiss alerts.
	 */
	public function can_dismiss() {
		return \current_user_can( 'edit_posts' );
	}
}
