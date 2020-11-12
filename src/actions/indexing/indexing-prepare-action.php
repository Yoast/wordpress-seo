<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast_Notification_Center;

/**
 * Class Indexing_Prepare_Action.
 *
 * Action for preparing the indexing routine.
 */
class Indexing_Prepare_Action {

	/**
	 * The notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Action for preparing the indexing routine.
	 *
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Indexing_Helper $indexing_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->indexing_helper     = $indexing_helper;
		$this->notification_center = $notification_center;
	}

	/**
	 * Prepares the indexing routine.
	 *
	 * @return void
	 */
	public function prepare() {
		$this->indexing_helper->start();

		$this->notification_center->remove_notification_by_id( Indexing_Notification_Integration::NOTIFICATION_ID );
	}
}
