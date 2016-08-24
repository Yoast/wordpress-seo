<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Separator extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( 'separator' );

		// @todo apply i18n

		$this->set_property( 'label', 'Separator' );

		// todo: see if we can apply the prefix in a nice way

		$this->add_choice( 'sc-dash', '-', 'Dash' );
		$this->add_choice( 'sc-ndash', '&ndash;', 'En dash' );
		$this->add_choice( 'sc-mdash', '&mdash;', 'Em dash' );
		$this->add_choice( 'sc-middot', '&middot;', 'Middle dot' );
		$this->add_choice( 'sc-bull', '&bull;', 'Bullet' );
		$this->add_choice( 'sc-star', '*', 'Asterisk' );
		$this->add_choice( 'sc-smstar', '&#8902;', 'Low asterisk' );
		$this->add_choice( 'sc-pipe', '|', 'Vertical bar' );
		$this->add_choice( 'sc-tilde', '~', 'Small tilde' );
		$this->add_choice( 'sc-laquo', '&laquo;', 'Left angle quotation mark' );
		$this->add_choice( 'sc-raquo', '&raquo;', 'Right angle quotation mark' );
		$this->add_choice( 'sc-lt', '&lt;', 'Less than sign' );
		$this->add_choice( 'sc-gt', '&gt;', 'Greate than sign' );
	}
}
