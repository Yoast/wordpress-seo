<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Post_Type_Visibility extends WPSEO_Config_Field {

	private $post_types;

	public function __construct() {
		parent::__construct( 'postTypeVisibility', 'PostTypeVisibility' );

		$post_types = $this->get_post_types();

		// @todo apply i18n
		$this->set_property( 'label', 'Please specify if which of the following public post types you would like Google to see' );
		$this->set_property( 'postTypes', $post_types );
	}

	protected function get_post_types() {
		if ( ! isset( $this->post_types ) ) {

			$post_types = get_post_types( array(
				'public' => true
			), 'objects' );

			$this->post_types = array_map( array( $this, 'get_label' ), $post_types );
		}

		return $this->post_types;
	}

	protected function get_label( $post_type_object ) {
		return $post_type_object->label;
	}

	public function get_data() {

		$post_types = array_keys( $this->post_types );
		$post_types = array_flip( $post_types );

		// Loop through post types.
		return array_map( '__return_true', $post_types );
	}
}
