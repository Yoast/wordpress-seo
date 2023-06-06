<?php

namespace Yoast\WP\SEO\Content_Type_Visibility\Application;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast_Notification_Center;

/**
 * Notifications for new content types.
 * This class is responsible for showing notifications for new content types.
 */
class Content_Type_Visibility_Dismiss_Notifications {

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
	 * Dismisses an alert.
	 *
	 * @param WP_REST_Request $request The request. This request should have a key param set.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function post_type_dismiss( $request ) {
		$success = true;
		$message = 'Post type is not new.';

		$post_types_needs_review = $this->options->get( 'new_post_types', [] );

		if ( \in_array( $request['postTypeName'], $post_types_needs_review, true ) ) {
			$new_needs_review = \array_diff( $post_types_needs_review, [ $request['postTypeName'] ] );
			$success          = $this->options->set( 'new_post_types', $new_needs_review );
			$message          = ( $success ) ? 'Post type is no longer new.' : 'Error: Post type was not removed from new_post_types list.';
			$this->maybe_dismiss_notifications();
		}

		$status = $success === ( true ) ? 200 : 400;

		return new WP_REST_Response(
			(object) [
				'message' => $message,
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
		$success = true;
		$message = 'Taxonomy is not new.';

		$taxonomies_needs_review = $this->options->get( 'new_taxonomies', [] );

		if ( \in_array( $request['taxonomyName'], $taxonomies_needs_review, true ) ) {

			$new_needs_review = \array_diff( $taxonomies_needs_review, [ $request['taxonomyName'] ] );
			$success          = $this->options->set( 'new_taxonomies', $new_needs_review );
			$message          = ( $success ) ? 'Taxonomy is no longer new.' : 'Error: Taxonomy was not removed from new_taxonomies list.';
			$this->maybe_dismiss_notifications();
		}

		$status = $success === ( true ) ? 200 : 400;

		return new WP_REST_Response(
			(object) [
				'message' => $message,
				'success' => $success,
				'status'  => $status,
			],
			$status
		);
	}

	/**
	 * Checks if there are new content types or taxonomies.
	 *
	 * @return bool
	 */
	public function maybe_dismiss_notifications() {
		$taxonomies_needs_review = $this->options->get( 'new_taxonomies', [] );
		$post_types_needs_review = $this->options->get( 'new_post_types', [] );
		if ( $post_types_needs_review || $taxonomies_needs_review ) {
			return;
		}
		$this->dismiss_notifications();
	}

	/**
	 * Dismisses the notification in the notification center when there are no more new content types.
	 *
	 * @return bool
	 */
	public function dismiss_notifications() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'content-types-made-public' );
		return $this->options->set( 'show_new_content_type_notification', false );
	}
}
