<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Separator
 */
class WPSEO_Config_Field_Separator extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Separator constructor.
	 */
	public function __construct() {
		parent::__construct( 'separator' );

		$this->set_property( 'label', __( 'Title Separator', 'wordpress-seo' ) );
		$this->set_property( 'explanation', __( 'Choose the symbol to use as your title separator. This will display, for instance, between your post title and site name. Symbols are shown in the size they\'ll appear in the search results.', 'wordpress-seo' ) );

		$this->add_choice( 'sc-dash', '-', __( 'Dash', 'wordpress-seo' ) );
		$this->add_choice( 'sc-ndash', '&ndash;', __( 'En dash', 'wordpress-seo' ) );
		$this->add_choice( 'sc-mdash', '&mdash;', __( 'Em dash', 'wordpress-seo' ) );
		$this->add_choice( 'sc-middot', '&middot;', __( 'Middle dot', 'wordpress-seo' ) );
		$this->add_choice( 'sc-bull', '&bull;', __( 'Bullet', 'wordpress-seo' ) );
		$this->add_choice( 'sc-star', '*', __( 'Asterisk', 'wordpress-seo' ) );
		$this->add_choice( 'sc-smstar', '&#8902;', __( 'Low asterisk', 'wordpress-seo' ) );
		$this->add_choice( 'sc-pipe', '|', __( 'Vertical bar', 'wordpress-seo' ) );
		$this->add_choice( 'sc-tilde', '~', __( 'Small tilde', 'wordpress-seo' ) );
		$this->add_choice( 'sc-laquo', '&laquo;', __( 'Left angle quotation mark', 'wordpress-seo' ) );
		$this->add_choice( 'sc-raquo', '&raquo;', __( 'Right angle quotation mark', 'wordpress-seo' ) );
		$this->add_choice( 'sc-lt', '&lt;', __( 'Less than sign', 'wordpress-seo' ) );
		$this->add_choice( 'sc-gt', '&gt;', __( 'Greater than sign', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo_titles', 'separator' );
	}
}
