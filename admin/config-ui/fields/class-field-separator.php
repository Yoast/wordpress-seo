<?php

class WPSEO_Config_Field_Separator extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( 'separator' );

		$this->set_property( 'label', 'Separator' );

		// @todo Sync with internal option values!

		$this->add_choice( 'dash', '-', 'Dash' );
		$this->add_choice( 'ndash', '–', 'En dash' );
		$this->add_choice( 'mdash', '—', 'Em dash' );
		$this->add_choice( 'middot', '·', 'Middle dot' );
		$this->add_choice( 'bull', '•', 'Bullet' );
		$this->add_choice( 'asterisk', '*', 'Asterisk' );
		$this->add_choice( 'lowast', '⁎', 'Low asterisk' );
		$this->add_choice( 'pipe', '|', 'Vertical bar' );
		$this->add_choice( 'tilde', '~', 'Small tilde' );
		$this->add_choice( 'laquo', '«', 'Left angle quotation mark' );
		$this->add_choice( 'raquo', '»', 'Right angle quotation mark' );
		$this->add_choice( 'lt', '<', 'Less than sign' );
		$this->add_choice( 'gt', '>', 'Greate than sign' );
	}
}
