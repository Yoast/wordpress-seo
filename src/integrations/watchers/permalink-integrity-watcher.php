<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Indexable_Helper;

/**
 * WordPress Permalink structure watcher.
 *
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Permalink_Integrity_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The indexable permalink watcher.
	 *
	 * @var Indexable_Permalink_Watcher
	 */
	protected $indexable_permalink_watcher;

	/**
	 * The indexable home url watcher.
	 *
	 * @var Indexable_HomeUrl_Watcher
	 */
	protected $indexable_homeurl_watcher;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Permalink_Integrity_Watcher constructor.
	 *
	 * @param Indexable_Helper $indexable The indexable helper.
	 */
	public function __construct( Indexable_Helper $indexable, Options_Helper $option, Indexable_Permalink_Watcher $permalink_watcher,
								 Indexable_HomeUrl_Watcher $homeurl_watcher ) {
		$this->indexable_helper            = $indexable;
		$this->options_helper              = $option;
		$this->indexable_permalink_watcher = $permalink_watcher;
		$this->indexable_homeurl_watcher   = $homeurl_watcher;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_frontend_presentation', [ $this, 'compare_indexable_permalinks' ], 10, 1 );
	}

	/**
	 * Compares the indexable permalinks and tries to find the cause if they differ.
	 *
	 * @return void
	 */
	public function compare_indexable_permalinks( $presentation ) {
		 // check if last samples were taken 1 week ago or more and if so take more samples
		$permalinks_indexables_types = $this->options_helper->get( 'permalinks_indexables_types' );
		foreach ( $permalinks_indexables_types as $link ) {
			if ( $link >= ( \time() - ( 60 * 60 * 24 * 7 ) ) ) {
				// less then a week ago, do nothing
				return;
			}
		}

		// compare the permalinks
		if ( $presentation->model->permalink === $this->permalink_helper->get_permalink_for_indexable( $presentation->model ) ) {
			// update the timestamps and clear the possible notification
			$this->updatePermalinkSamples();
			\Yoast_Notification_Center::get()->remove_notification_by_id( 'permalink-integrity-warning' );
			$this->options_helper->set( 'dynamic_permalinks', false );
			return;
		}

		// permalinks differ, find cause
		// reset the permalinks and taxonomies if necessary
		if ( $this->indexable_permalink_watcher->should_reset_permalinks() ||
			$this->indexable_permalink_watcher->should_reset_categories() ||
			$this->indexable_permalink_watcher->should_reset_tags() ) {
			// in case of the categories or tags, they will be automatically reset and no notification will be thrown.
			$this->indexable_permalink_watcher->force_reset_permalinks();
			die();
			return;
		}

		// try to reset the home url indexables
		if ( $this->indexable_homeurl_watcher->should_reset_permalinks() ) {
			$this->indexable_homeurl_watcher->force_reset_permalinks();
			return;
		}

		// unknown cause, show notification
		$this->options_helper->set( 'dynamic_permalinks', true );
		\Yoast_Notification_Center::get()->add_notification( $this->get_notification() );
	}

	private function updatePermalinkSamples() {
		 $new_permalinks_indexables_types = $this->indexable_helper->take_permalink_sample_array();
		$this->options_helper->set( 'permalinks_indexables_types', $new_permalinks_indexables_types );
	}

	/**
	 * Gets the notification object.
	 *
	 * @return Yoast_Notification
	 */
	protected function get_notification() {
		$message = 'We had to activate legacy mode in our plugin to solve permalink issues. This may be caused by a plugin conflict. Please send diagnostics data to our servers so we can track down this issue';

		$notification = new \Yoast_Notification(
			$message,
			[
				'type'         => \Yoast_Notification::WARNING,
				'id'           => 'permalink-integrity-warning',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		return $notification;
	}
}
