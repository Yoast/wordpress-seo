<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Multiple_Authors
 */
class WPSEO_Config_Field_Multiple_Authors extends WPSEO_Config_Field_Choice {
	/**
	 * WPSEO_Config_Field_Multiple_Authors constructor.
	 */
	public function __construct() {
		parent::__construct( 'multipleAuthors' );

		$this->set_property( 'label', __( 'Does your site have multiple authors?', 'wordpress-seo' ) );

		$this->add_choice( 'yes', __( 'Yes', 'wordpress-seo' ) );
		$this->add_choice( 'no', __( 'No', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo', 'has_multiple_authors' );
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
