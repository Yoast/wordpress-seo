<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Publishing_Entity
 */
class WPSEO_Config_Field_Publishing_Entity extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Publishing_Entity constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntity', 'HTML' );

		$this->set_property( 'html', __( 'Set the type of publisher of this website.', 'wordpress-seo' ) );
	}
}
