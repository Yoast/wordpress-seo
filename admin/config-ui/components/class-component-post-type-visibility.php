<?php

class WPSEO_Config_Component_Post_Type_Visibility implements WPSEO_Config_Component {

	private $option;

	/**
	 * @return string
	 */
	public function get_identifier() {
		return 'postTypeVisibility';
	}

	/**
	 * @return mixed
	 */
	public function get_data() {

		$post_types = get_post_types( array(
			'public' => true
		), 'names' );

		$this->option = WPSEO_Options::get_option( 'wpseo_xml' );

		array_walk( $post_types, array( $this, 'get_option_value' ) );

		return $post_types;
	}

	/**
	 * @param $data
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {


	}

	protected function get_option_value( & $value, $post_type ) {
		$key = 'post_types-' . $post_type . '-not_in_sitemap';
		$value = ( ! isset( $this->option[ $key ] ) || false === $this->option[ $key ] );
	}

	/**
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		return new WPSEO_Config_Field_Post_Type_Visibility();
	}
}