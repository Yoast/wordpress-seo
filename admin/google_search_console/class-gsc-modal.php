<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Represents the Google Search Console modal.
 */
class WPSEO_GSC_Modal {

	/**
	 * @var string
	 */
	protected $view;

	/**
	 * @var int
	 */
	protected $height;

	/**
	 * @var array
	 */
	protected $view_vars;

	/**
	 * Sets the required attributes for this object.
	 *
	 * @param string $view      The file with the view content.
	 * @param int    $height    The height that the modal will get.
	 * @param array  $view_vars The attributes to use in the view.
	 */
	public function __construct( $view, $height, array $view_vars = array() ) {
		$this->view      = $view;
		$this->height    = $height;
		$this->view_vars = $view_vars;
	}

	/**
	 * Returns the height of the modal.
	 *
	 * @return int The set height.
	 */
	public function get_height() {
		return $this->height;
	}

	/**
	 * Loads the view of the modal.
	 *
	 * @param string $unique_id An unique identifier for the modal.
	 */
	public function load_view( $unique_id ) {
		extract( $this->view_vars );

		echo '<div id="' . esc_attr( 'redirect-' . $unique_id ) . '" class="hidden">';
		echo '<div class="form-wrap wpseo_content_wrapper">';
		require $this->view;
		echo '</div>';
		echo '</div>';
	}
}
