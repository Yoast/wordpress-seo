<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast_Notification_Center;

/**
 * Action for preparing the indexable indexation routine.
 */
class Indexable_Prepare_Indexation_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	protected $date;

	/**
	 * The notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Action for preparing the indexable indexation routine.
	 *
	 * @param Options_Helper            $options             The options helper.
	 * @param Date_Helper               $date                The date helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Options_Helper $options,
		Date_Helper $date,
		Yoast_Notification_Center $notification_center
	) {
		$this->options             = $options;
		$this->date                = $date;
		$this->notification_center = $notification_center;
	}

	/**
	 * Prepare the indexable indexation routine.
	 *
	 * @return void
	 */
	public function prepare() {
		$this->options->set( 'indexing_first_time', false );
		$this->options->set( 'indexation_started', $this->date->current_time() );

		$this->notification_center->remove_notification_by_id( Indexing_Notification_Integration::NOTIFICATION_ID );
	}
}
