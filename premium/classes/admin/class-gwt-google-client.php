<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

require_once( WPSEO_PREMIUM_PATH . 'classes/admin/google/Google_Client.php' );

class WPSEO_GWT_Google_Client extends Google_Client {

	public function __construct() {

		parent::__construct();

		$this->setApplicationName( "WordPress SEO Premium" ); // Not sure if used
		$this->setClientId( '887668307827-4jhsr06rntrt3g3ss2r72dblf3ca7msv.apps.googleusercontent.com' );
		$this->setClientSecret( 'pPW5gLoTNtNHyiDH6YRn-CIB' );
		$this->setRedirectUri( 'urn:ietf:wg:oauth:2.0:oob' );
		$this->setScopes( array( 'https://www.google.com/webmasters/tools/feeds/' ) );

	}

}