<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Output_Decorator
 */
class WPSEO_Redirect_Output_Decorator {

	/**
	 * Make sure the origin column is presented correctly to the user.
	 *
	 * @param string         $value    The value of the string to format.
	 * @param WPSEO_Redirect $redirect The redirect.
	 *
	 * @return string
	 */
	public static function decorate_origin_column( $value, WPSEO_Redirect $redirect ) {
		$value = esc_html( $value );

		if ( $redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN ) {
			$value = '<span class="redirect_table_row_origin_slash">/</span>' . $value . '<span class="redirect_table_row_origin_slash">/</span>';
		}

		return $value;
	}

	/**
	 * Make sure the target column is presented correctly to the user.
	 *
	 * @param  string $value The value of the string to format.
	 *
	 * @return string
	 */
	public static function decorate_target_column( $value ) {
		$value = esc_html( $value );

		$scheme = parse_url( $value, PHP_URL_SCHEME );

		// Check whether $scheme is a relative or absolute URL.
		if ( empty( $scheme ) ) {
			$value = '<span class="redirect_table_row_origin_slash">/</span>' . $value . '<span class="redirect_table_row_target_slash">/</span>';
		}

		return $value;
	}

}
