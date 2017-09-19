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

		$copy = __( 'Please specify which post types you want search engines to index.
 If you do not know the differences between these, it\'s best to choose the
 default settings. For instance, setting \'Media\' to visible would index your
 images which could lead to visitors finding your images without ever
 coming to your site. If you have a custom post type on your site, you need
 to activate these manually.', 'wordpress-seo' );

		$html = '<p>' . esc_html( $copy ) . '</p><br/>';

		$this->set_property( 'html', $html );
	}
}
