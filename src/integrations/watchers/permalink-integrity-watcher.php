<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;

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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Permalink_Integrity_Watcher constructor.
	 *
	 * @param Options_Helper $option The options helper.
	 * @param Indexable_Permalink_Watcher $permalink_watcher The indexable permalink watcher.
	 * @param Indexable_HomeUrl_Watcher $homeurl_watcher The home url watcher.
	 */
	public function __construct( Options_Helper $option,
								 Indexable_Permalink_Watcher $permalink_watcher,
								 Indexable_HomeUrl_Watcher $homeurl_watcher ) {
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
		\add_action( 'wpseo_frontend_presentation', [ $this, 'compare_permalink_for_page' ], 10, 1 );
	}

	/**
	 * Checks if the permalink integrity check should be performed.
	 *
	 * Returns true if the dynamic permalink mode has not been activated,
	 * and the type has not been checked in the past week.
	 * Returns false otherwise.
	 *
	 * @param string $type String containing the type - subtype of the indexable.
	 * @param array $permalink_samples The permalink samples array.
	 *
	 * @return boolean Whether the permalink integrity check should be performed.
	 */
	public function should_perform_check( $type, $permalink_samples ) {
		return ! $this->options_helper->get( 'dynamic_permalinks', false )
			    && $permalink_samples[ $type ] >= ( \time() - ( 60 * 60 * 24 * 7 ) );
	}

	/**
	 * Compares the permalink of the current page to the indexable permalink. If it is not the same, the
	 * First checks if the type of the current page has been checked in the past week, if not performs the check.
	 *
	 * @param Indexable_Presentation $presentation The indexables presentation.
	 *
	 * @return void
	 */
	public function compare_permalink_for_page( $presentation ) {
		$model = $presentation->model;

		$permalink_samples = $this->options_helper->get( 'permalinks_indexables_types' );
		$type 			   = $model->indexable->object_type . '-' . $model->indexable->object_sub_type;

		if ( ! $this->should_perform_check( $type, $permalink_samples ) ) {
			update_permalink_samples( $type, $permalink_samples );
			return;
		}

		// if permalink of current page is the same as the indexable permalink, do nothing.
		if ( $model->permalink === $this->permalink_helper->get_permalink_for_indexable( $model ) ) {
			update_permalink_samples( $type, $permalink_samples );
			return;
		}

		if ( $this->indexable_permalink_watcher->should_reset_permalinks() ||
			 $this->indexable_permalink_watcher->should_reset_categories() ||
			 $this->indexable_permalink_watcher->should_reset_tags()
		) {
			$this->indexable_permalink_watcher->force_reset_permalinks();
			update_permalink_samples( $type, $permalink_samples );
			return;
		}

		if ( $this->indexable_homeurl_watcher->should_reset_permalinks() ) {
			$this->indexable_homeurl_watcher->force_reset_permalinks();
			update_permalink_samples( $type, $permalink_samples );
			return;
		}

		// If no reason is found for the difference in permalinks, the dynamic permalink mode is enabled.
		$this->options_helper->set( 'dynamic_permalinks', true );
		Yoast_Notification_Center::get()->add_notification( $this->get_notification() );
	}

	/**
	 * Updated the permalinks_indexables_types options with a new timestamp for $type.
	 *
	 * @param string $type String containing the type - subtype of the indexable.
	 * @param array $permalink_samples The permalink samples array.
	 *
	 * @return void
	 */
	private function update_permalink_samples( $type, $permalink_samples ) {
		$permalink_samples[ $type ] = \time();
		$this->options_helper->set( 'permalinks_indexables_types', $permalink_samples );
	}

	/**
	 * Gets the notification object.
	 *
	 * @return Yoast_Notification
	 */
	protected function get_notification() {
		$message = 'We had to activate legacy mode in our plugin to solve permalink issues. This may be caused by a plugin conflict. Please send diagnostics data to our servers so we can track down this issue';

		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'permalink-integrity-warning',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		return $notification;
	}
}
