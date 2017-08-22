<?php
/**
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Company_Or_Person
 */
class WPSEO_Config_Field_Company_Or_Person extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Company_Or_Person constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityType' );

		$this->set_property( 'label', __( 'Does your site represent a person or company?', 'wordpress-seo' ) );

		$html = __( 'This information will be used in Google\'s Knowledge Graph Card, the big ' .
					'block of information you see on the right side of the search results.', 'wordpress-seo' );

		$html = '<p>' . esc_html( $html ) . '</p>';

		$this->set_property( 'html', $html );

		$this->set_property( 'decoration', plugin_dir_url( WPSEO_FILE ) . 'images/google-knowledge-card.png' );

		$this->add_choice( 'company', __( 'Company', 'wordpress-seo' ) );
		$this->add_choice( 'person', __( 'Person', 'wordpress-seo' ) );
	}

	/**
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo', 'company_or_person' );
	}
}
