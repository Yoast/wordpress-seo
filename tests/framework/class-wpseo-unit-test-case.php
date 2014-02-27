<?php

/**
* TestCase base class for convenience methods.
*/
class WPSEO_UnitTestCase extends WP_UnitTestCase {

	function set_post( $key, $value ) {
		$_POST[$key] = $_REQUEST[$key] = addslashes( $value );
	}

	function unset_post( $key ) {
		unset( $_POST[$key], $_REQUEST[$key] );
	}
}