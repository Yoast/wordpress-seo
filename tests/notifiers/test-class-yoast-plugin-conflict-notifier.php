<?php

/**
 * @package WPSEO\Tests\Notifiers
 */

/**
 * Class Test_Yoast_Plugin_Conflict
 */
class Test_Yoast_Plugin_Conflict extends Yoast_Plugin_Conflict {
	/** @var array plugins */
	protected $plugins = array(
		'section' => array(
			'plugin 1' => 'Plugin 1',
		),
	);

	/**
	 * Check if given plugin exists in array with all_active_plugins
	 *
	 * @param string $plugin Plugin basename string.
	 *
	 * @return bool
	 */
	protected function check_plugin_is_active( $plugin ) {
		return true;
	}

	/**
	 * @param string $plugin_section Glue this section.
	 *
	 * @return string
	 */
	public function get_conflicting_plugins_as_string( $plugin_section ) {
		return implode( ' &amp; ', $this->plugins[ $plugin_section ] );
	}
}

/**
 * Class Test_Yoast_Plugin_Conflict_Notifier
 */
class Test_Yoast_Plugin_Conflict_Notifier extends WPSEO_UnitTestCase {

	/**
	 * Get notification should return a Yoast_Notification
	 */
	public function test_get_notification_return_value() {
		/*
		$wpseo_plugin_conflict = Test_Yoast_Plugin_Conflict::get_instance();

		$subject = new Yoast_Plugin_Conflict_Notifier( $wpseo_plugin_conflict, 'section', 'readable plugin section name' );

		$this->assertTrue( $subject->get_notification() instanceof Yoast_Notification );
		*/
	}

}
