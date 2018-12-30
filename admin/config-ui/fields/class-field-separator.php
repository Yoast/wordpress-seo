<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Separator.
 */
class WPSEO_Config_Field_Separator extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Separator constructor.
	 */
	public function __construct() {
		parent::__construct( 'separator' );

		$this->set_property( 'label', __( 'Title Separator', 'wordpress-seo' ) );
		$this->set_property( 'explanation', __( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name. Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' ) );

		$this->add_choices();
	}

	/**
	 * Adds the title separator choices.
	 */
	protected function add_choices() {
		$choices = WPSEO_Option_Titles::get_instance()->get_separator_options_for_display();
		foreach ( $choices as $key => $value ) {
			$this->add_choice( $key, $value['label'], $value['aria_label'] );
		}
	}

	/**
	 * Set adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'separator' );
	}
}
