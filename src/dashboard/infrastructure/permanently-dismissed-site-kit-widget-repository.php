<?php
namespace Yoast\WP\SEO\Dashboard\Infrastructure;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Stores and retrieves whether the Site Kit widget is permanently dismissed.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Permanently_Dismissed_Site_Kit_Widget_Repository implements Permanently_Dismissed_Site_Kit_Widget_Repository_Interface {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the class.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Sets the Site Kit dismissal status.
	 *
	 * @param bool $is_dismissed The dismissal status.
	 *
	 * @return bool False when the update failed, true when the update succeeded.
	 */
	public function set_site_kit_widget_dismissal( bool $is_dismissed ): bool {
		return $this->options_helper->set( 'site_kit_widget_permanently_dismissed', $is_dismissed );
	}

	/**
	 * Checks if the Site Kit widget is dismissed permanently.
	 * *
	 *
	 * @return bool True when the widget is dismissed, false when it is not.
	 */
	public function is_site_kit_widget_dismissed(): bool {
		return $this->options_helper->get( 'site_kit_widget_permanently_dismissed', false );
	}
}
