<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the class for Alerts.
 */
class WPSEO_Alert {

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
	 * WPSEO_Alert constructor.
	 *
	 * @param string $type Type of the Alert (error/info/success/warning).
	 * @param string $content Content of the Alert.
	 */
	public function __construct( $type, $content ) {
		$this->type = $type;
		$this->content = $content;
	}

	/**
	 * Adds string (view) behaviour to the Alert.
	 *
	 * @return string
	 */
	public function __toString() {
		return $this->render();
	}

	/**
	 * Renders the Alert as a styled string.
	 *
	 * @return string The styled Alert
	 */
	private function render() {
		$out  = '<div class="wpseo-alert wpseo-alert__' . $this->type . '">';

		$out .= '<span class="wpseo-alert-icon">';
		$icon_file = 'images/alert-' . $this->type . '-icon.svg';
		$out .= '<img src="' . esc_url( plugin_dir_url( WPSEO_FILE ) . $icon_file )
					. '" class="wpseo-alert__icon">';
		$out .= '</span>';

		$out .= '<span>' . $this->content . '</span>';
		$out .= '</div>';

		return $out;
	}

}
