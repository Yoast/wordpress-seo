<?php
/**
 * Presenter class for Alert boxes.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Represents the class for Alerts.
 */
class Alert_Presenter extends Abstract_Presenter {

	/**
	 * Alert type.
	 *
	 * @var string
	 */
	const ERROR = 'error';

	/**
	 * Alert type.
	 *
	 * @var string
	 */
	const INFO = 'info';

	/**
	 * Alert type.
	 *
	 * @var string
	 */
	const SUCCESS = 'success';

	/**
	 * Alert type.
	 *
	 * @var string
	 */
	const WARNING = 'warning';

	/**
	 * The type of the Alert.
	 *
	 * Can be: "error", "info", "success" or "warning".
	 * Controls the colours and icon of the Alert.
	 *
	 * @var string
	 */
	private $type = '';

	/**
	 * Content of the Alert.
	 *
	 * @var string
	 */
	private $content = '';

	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Alert_Presenter constructor.
	 *
	 * @param string $type    Type of the Alert (error/info/success/warning).
	 * @param string $content Content of the Alert.
	 */
	public function __construct( $type, $content ) {
		$this->type    = $type;
		$this->content = $content;

		if ( ! $this->asset_manager ) {
			$this->asset_manager = new \WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager->enqueue_style( 'alert' );
	}

	/**
	 * Presents the Alert.
	 *
	 * @return string The styled Alert.
	 */
	public function present() {
		$icon_file = 'images/alert-' . $this->type . '-icon.svg';

		$out  = '<div class="yoast-alert yoast-alert--' . $this->type . '">';
		$out .= '<span>';
		$out .= '<img class="yoast-alert__icon" src="' . esc_url( plugin_dir_url( WPSEO_FILE ) . $icon_file ) . '" alt="" />';
		$out .= '</span>';

		$out .= '<span>' . $this->content . '</span>';
		$out .= '</div>';

		return $out;
	}
}
