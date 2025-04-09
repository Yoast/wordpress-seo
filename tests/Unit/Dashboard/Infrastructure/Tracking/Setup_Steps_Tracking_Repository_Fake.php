<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking;

use Exception;
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
	 * Whether set_setup_steps_tracking_element should return false.
	 *
	 * @var bool
	 */
	private $should_set_fail;

	/**
	 * Whether set_setup_steps_tracking_element should throw an exception.
	 *
	 * @var bool
	 */
	private $should_set_raise_exception;

	/**
	 * Class constructor.
	 *
	 * @param bool $should_set_fail            Whether set_setup_steps_tracking_element should return false.
	 * @param bool $should_set_raise_exception Whether set_setup_steps_tracking_element should throw an exception.
	 *
	 * @return void
	 */
	public function __construct( bool $should_set_fail = false, bool $should_set_raise_exception = false ) {
		$this->should_set_fail            = $should_set_fail;
		$this->should_set_raise_exception = $should_set_raise_exception;
	}

	/**
	 * Sets an element in the Site Kit usage tracking array.
	 *
	 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- This is a fake..
	 *
	 * @param string $element_name  The name of the element to set.
	 * @param string $element_value The value of the element to set.
	 *
	 * @return bool False when the update failed, true when the update succeeded.
	 *
	 * @throws Exception When unable to save data.
	 */
	public function set_setup_steps_tracking_element( string $element_name, string $element_value ): bool {
		if ( $this->should_set_fail ) {
			return false;
		}
		if ( $this->should_set_raise_exception ) {
			throw new Exception( 'Unable to save data.' );
		}
		return true;
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
			case 'setup_widget_temporarily_dismissed':
			case 'setup_widget_permanently_dismissed':
				return 'no';
			default:
				return '';
		}
	}
}
