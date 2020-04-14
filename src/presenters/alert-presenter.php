<?php
/**
 * Presenter class for Alert boxes.
 *
 * @package Yoast\YoastSEO\Presenters
 */

/**
 * Represents the class for Alerts.
 */
class Alert_Presenter {

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
	 * Alert_Presenter constructor.
	 *
	 * @param string $type 	  Type of the Alert (error/info/success/warning).
	 * @param string $content Content of the Alert.
	 */
	public function __construct( $type, $content ) {
		$this->type = $type;
		$this->content = $content;
		$this->enqueue_assets();
	}

	/**
	 * Enqueue assets.
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'alert' );
	}

	/**
	 * Adds string (view) behaviour to the Alert.
	 *
	 * @return string The rendered Alert.
	 */
	public function __toString() {
		return $this->render();
	}

	/**
	 * Renders the Alert as a styled string.
	 *
	 * @return string The styled Alert.
	 */
	private function render() {
		$out  = '<div class="alert alert__' . $this->type . '">';

		$out .= '<span>';
		$icon_file = 'images/alert-' . $this->type . '-icon.svg';
		$out .= '<img class="icon" src="' . esc_url( plugin_dir_url( WPSEO_FILE ) . $icon_file ) . '" alt=""/>';
		$out .= '</span>';

		$out .= '<span>' . $this->content . '</span>';
		$out .= '</div>';

		return $out;
	}

}
