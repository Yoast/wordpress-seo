<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking;

use Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository_Interface;

/**
 * Fake class for the Site Kit Usage Tracking Repository.
 *
 * @group Site_Kit_Usage_Tracking_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_Repository_Fake implements Setup_Steps_Tracking_Repository_Interface {

	/**
	 * Sets an element in the Site Kit usage tracking array.
	 *
	 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- This is a fake..
	 *
	 * @param string $element_name  The name of the element to set.
	 * @param string $element_value The value of the element to set.
	 *
	 * @return bool False when the update failed, true when the update succeeded.
	 */
	public function set_setup_steps_tracking_element( string $element_name, string $element_value ): bool {
		if ( \in_array(
			$element_name,
			[
				'setup_widget_loaded',
				'first_interaction_stage',
				'last_interaction_stage',
				'setup_widget_dismissed',
			],
			true
		) ) {
			return true;
		}
		return false;
	}

	/**
	 * Gets an element from the Site Kit usage tracking array.
	 *
	 * @param string $element_name The name of the element to get.
	 *
	 * @return string The value of the element.
	 */
	public function get_setup_steps_tracking_element( string $element_name ): string {
		switch ( $element_name ) {
			case 'setup_widget_loaded':
				return 'yes';
			case 'first_interaction_stage':
				return 'INSTALL';
			case 'last_interaction_stage':
				return 'CONNECT';
			case 'setup_widget_dismissed':
				return 'no';
			default:
				return '';
		}
	}
}
