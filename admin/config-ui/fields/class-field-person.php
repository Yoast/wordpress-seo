<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Person_Name
 */
class WPSEO_Config_Field_Person extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Company_Or_Person constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityPersonId', 'WordPressUserSelector' );

		$this->set_property( 'label', __( 'The person', 'wordpress-seo' ) );
		$this->set_property( 'user', $this->get_user_id() );

		$this->set_requires( 'publishingEntityType', 'person' );
	}

	/**
	 * Get the entity person id.
	 *
	 * @return int|null User id.
	 */
	public function get_user_id() {
		$user = get_user_by( 'ID', WPSEO_Options::get( 'company_or_person_user_id' ) );

		if ( $user === false ) {
			return null;
		}

		return (int) $user->get( 'ID' );

	}

	/**
	 * Sets the adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'company_or_person_user_id' );
	}
}
