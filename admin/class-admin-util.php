<?php

class WPSEO_Admin_Util {

	/**
	 * Wrapper for the PHP filter input function.
	 *
	 * This is used because stupidly enough, the `filter_input` function is not available on all hosts...
	 *
	 * @param int    $type
	 * @param string $variable_name
	 * @param int    $filter
	 *
	 * @return mixed
	 */
	public static function filter_input( $type, $variable_name, $filter = FILTER_DEFAULT ) {
		if ( function_exists( 'filter_input' ) ) {
			return filter_input( $type, $variable_name, $filter );
		} else {
			switch ( $type ) {
				case INPUT_GET:
					$type = $_GET;
					break;
				case INPUT_POST:
					$type = $_POST;
					break;
				case INPUT_SERVER:
					$type = $_SERVER;
					break;
				default:
					return false;
					break;
			}

			if ( isset( $type[ $variable_name ] ) ) {
				$out = $type[ $variable_name ];
			} else {
				return false;
			}

			switch ( $filter ) {
				case FILTER_VALIDATE_INT:
					return (int) $out;
					break;
				default:
					return (string) $out;
					break;
			}
		}
	}

}