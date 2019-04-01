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
		$this->set_property( 'user', $this->map_user_for_input( get_user_by( 'ID', WPSEO_Options::get( 'company_or_person_user_id' ) ) ) );

		$this->set_requires( 'publishingEntityType', 'person' );
	}

	/**
	 * Maps the user to be used by the input.
	 *
	 * @param WP_User $user The user to be mapped.
	 *
	 * @return array The mapped user.
	 */
	public function map_user_for_input( WP_User $user ) {
		return array(
			'value' => (int) $user->get( 'ID' ),
			'label' => $user->get( 'display_name' ),
		);
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
