<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification_Center;

/**
 * Link_Count_Notification_Integration class.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Link_Count_Notification_Integration implements Integration_Interface {

	/**
	 * The ID of the link indexing notification.
	 *
	 * @var string
	 */
	const NOTIFICATION_ID = 'wpseo-reindex-links';

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public static function get_conditionals() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return [ Admin_Conditional::class ];
	}

	/**
	 * Link_Count_Notification_Integration constructor.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param Yoast_Notification_Center $notification_center       The Yoast notification center.
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link indexing action.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Post_Link_Indexing_Action $post_link_indexing_action
	) {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Initializes the integration.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Removes the notification when it is set and the amount of unindexed items is lower than the threshold.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function cleanup_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Adds the notification when it isn't set already and the amount of unindexed items is greater than the set
	 * threshold.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function manage_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}
}
