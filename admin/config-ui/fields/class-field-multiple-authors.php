<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Multiple_Authors
 */
class WPSEO_Config_Field_Multiple_Authors extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( 'multipleAuthors' );

		// @todo apply i18n
		$this->set_property( 'label', "Does your site have multiple authors?" );

		$this->add_choice( 'yes', 'Yes' );
		$this->add_choice( 'no', 'No' );
	}

	/**
	 * @return null|string
	 */
	public function get_data() {
		// If there are more than one users with level > 1 default to multiple authors.
		$users = get_users( array( 'fields' => 'IDs', 'who' => 'authors' ) );
		return ( count( $users ) > 1 ) ? 'yes' : null;
	}
}
