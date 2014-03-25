<?php

/**
* TestCase base class for convenience methods.
*/
class WPSEO_UnitTestCase extends WP_UnitTestCase {

	protected function set_post( $key, $value ) {
		$_POST[$key] = $_REQUEST[$key] = addslashes( $value );
	}

	protected function unset_post( $key ) {
		unset( $_POST[$key], $_REQUEST[$key] );
	}

	protected function go_to_home() {
		$this->go_to( home_url() );
	}
}