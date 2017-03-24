<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Post_Type_Visibility
 */
class WPSEO_Config_Field_Post_Type_Visibility extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Post_Type_Visibility constructor.
	 */
	public function __construct() {
		parent::__construct( 'postTypeVisibility', 'HTML' );

		$copy = __( 'Please specify which of the following public post types you would like Google to see.', 'wordpress-seo' );

		$html = '<p>' . esc_html( $copy ) . '</p><br/>';

		$this->set_property( 'html', $html );
	}
}
