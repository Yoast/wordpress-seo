<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * ConfigurationWorkout_Notice_Integration class
 */
class ConfigurationWorkout_Notice_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Configuration_Workout_Integration constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'wp_ajax_dismiss_configuration_workout_notice', [ $this, 'dismiss_configuration_workout_notice' ] );
	}

	/**
	 * Dismisses the First-time configuration workout notice.
	 *
	 * @return bool
	 */
	public function dismiss_configuration_workout_notice() {
		return $this->options_helper->set( 'dismiss_configuration_workout_notice', true );
	}
}
