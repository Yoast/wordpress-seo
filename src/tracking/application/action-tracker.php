<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Tracking\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The tracker of actions.
 */
class Action_Tracker {

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Stores the version the user was on when an action was first performed.
	 *
	 * @param string $action_to_track The action to track.
	 *
	 * @return void
	 */
	public function track_version_for_performed_action( string $action_to_track ): void {
		$this->options_helper->set( $action_to_track, \WPSEO_VERSION );
	}
}
