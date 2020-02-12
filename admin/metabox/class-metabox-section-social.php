<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the React root element for a metabox social section.
 */
class WPSEO_Metabox_Section_Social extends WPSEO_Metabox_Section_Additional {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$name = 'wpseo-section-social';
		$link_content = '<span class="dashicons dashicons-share"></span>' . __( 'Social React', 'wordpress-seo' );

		parent::__construct( $name, $link_content );
	}

	/**
	 * @inheritDoc
	 */
	public function display_content() {
		$this->content = '<div id="' . $this->name . '"></div>';

		parent::display_content();
	}
}
