<?php
/**
 * @package WPSEO\Admin\Tracking
 */

/**
 * Represents the server data.
 */
class WPSEO_Tracking_Server_Data implements WPSEO_Collection {

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {
		return array(
			'server' => $this->get_server_data(),
		);
	}

	/**
	 * Returns the values with server details.
	 *
	 * @return array Array with the value.
	 */
	protected function get_server_data() {
		$server_data = array();

		// Validate if the server address is a valid IP-address.
		$ipaddress = filter_input( INPUT_SERVER, 'SERVER_ADDR', FILTER_VALIDATE_IP );
		if ( $ipaddress ) {
			$server_data['ip']       = $ipaddress;
			$server_data['Hostname'] = gethostbyaddr( $ipaddress );
		}

		$server_data['os']            = php_uname( 's r' );
		$server_data['PhpVersion']    = PHP_VERSION;
		$server_data['CurlVersion']   = $this->get_curl_info();
		$server_data['PhpExtensions'] = $this->get_php_extensions();

		return $server_data;
	}

	/**
	 * Returns details about the curl version.
	 *
	 * @return array|null The curl info. Or null when curl isn't available..
	 */
	protected function get_curl_info() {
		if ( ! function_exists( 'curl_version' ) ) {
			return null;
		}

		$curl = curl_version();

		$ssl_support = true;
		if ( ! $curl['features'] && CURL_VERSION_SSL ) {
			$ssl_support = false;
		}

		return array(
			'version'    => $curl['version'],
			'sslSupport' => $ssl_support,
		);
	}

	/**
	 * Returns a list with php extensions.
	 *
	 * @return array Returns the state of the php extensions.
	 */
	protected function get_php_extensions() {
		return array(
			'imagick' => extension_loaded( 'imagick' ),
			'filter'  => extension_loaded( 'filter' ),
			'bcmath'  => extension_loaded( 'bcmath' ),
			'modXml'  => extension_loaded( 'modXml' ),
			'pcre'    => extension_loaded( 'pcre' ),
			'xml'     => extension_loaded( 'xml' ),
		);
	}
}
