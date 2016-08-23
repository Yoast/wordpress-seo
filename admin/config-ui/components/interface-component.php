<?php

interface WPSEO_Config_Component {
	/**
	 * @return string
	 */
	public function get_identifier();

	/**
	 * @return mixed
	 */
	public function get_data();

	/**
	 * @param $data
	 *
	 * @return mixed
	 */
	public function set_data( $data );

	/**
	 * @return WPSEO_Config_Field
	 */
	public function get_field();
}