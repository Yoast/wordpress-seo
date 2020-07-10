<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Link_Count_Notification_Integration class.
 */
class Link_Count_Notification_Integration implements Integration_Interface {

	/**
	 * The ID of the link indexing notification.
	 *
	 * @var string
	 */
	const NOTIFICATION_ID = 'wpseo-reindex-links';

	/**
	 * The Yoast notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The post link indexing action.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Link_Count_Notification_Integration constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center       The Yoast notification center.
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link indexing action.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Post_Link_Indexing_Action $post_link_indexing_action
	) {
		$this->notification_center       = $notification_center;
		$this->post_link_indexing_action = $post_link_indexing_action;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( \filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			\add_action( 'admin_init', [ $this, 'cleanup_notification' ] );
		}

		if ( ! \wp_next_scheduled( self::NOTIFICATION_ID ) ) {
			\wp_schedule_event( time(), 'daily', self::NOTIFICATION_ID );
		}

		\add_action( self::NOTIFICATION_ID, [ $this, 'manage_notification' ] );
	}

	/**
	 * Removes the notification when it is set and the amount of unindexed items is lower than the threshold.
	 */
	public function cleanup_notification() {
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification === null || $this->post_link_indexing_action->get_total_unindexed() > 0 ) {
			return;
		}

		$this->notification_center->remove_notification( $notification );
	}

	/**
	 * Adds the notification when it isn't set already and the amount of unindexed items is greater than the set
	 * threshold.
	 */
	public function manage_notification() {
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification || $this->post_link_indexing_action->get_total_unindexed() === 0 ) {
			return;
		}

		$this->notification_center->add_notification( $this->create_notification() );
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function create_notification() {
		return new Yoast_Notification(
			esc_html__( 'To make sure all the links in your texts are counted, we need to analyze all your texts.', 'wordpress-seo' ) . ' ' .
			esc_html__( 'All you have to do is press the following button and we\'ll go through all your texts for you.', 'wordpress-seo' ) . '<br><br>' .
			'<button type="button" id="noticeRunLinkIndex" class="button">' . esc_html__( 'Count links', 'wordpress-seo' ) . '</button><br><br>' .
			sprintf(
				/* translators: 1: link to yoast.com post about internal linking suggestion. 2: is anchor closing. */
				esc_html__( 'The Text link counter feature provides insights in how many links are found in your text and how many links are referring to your text. This is very helpful when you are improving your %1$sinternal linking%2$s.', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/15m' ) . '" target="_blank">',
				'</a>'
			),
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}
}
