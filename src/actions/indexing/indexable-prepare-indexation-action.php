<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast_Notification_Center;

/**
 * Action for preparing the indexable indexing routine.
 */
class Indexable_Prepare_Indexation_Action {

	/**
	 * The notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	protected $date_helper;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Action for preparing the indexable indexing routine.
	 *
	 * @param Date_Helper               $date_helper         The date helper.
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Date_Helper $date_helper,
		Indexing_Helper $indexing_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->date_helper         = $date_helper;
		$this->indexing_helper     = $indexing_helper;
		$this->notification_center = $notification_center;
	}

	/**
	 * Prepare the indexable indexing routine.
	 *
	 * @return void
	 */
	public function prepare() {
		$this->indexing_helper->set_first_time( false );
		$this->indexing_helper->set_started( $this->date_helper->current_time() );

		$this->notification_center->remove_notification_by_id( Indexing_Notification_Integration::NOTIFICATION_ID );
	}
}
