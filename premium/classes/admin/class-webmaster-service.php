<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * The "webfonts" collection of methods.
 * Typical usage is:
 *  <code>
 *   $webfontsService = new Google_WebfontsService(...);
 *   $webfonts = $webfontsService->webfonts;
 *  </code>
 */
class Google_Webmaster_Service_Resource extends Google_ServiceResource {

	/**
	 * Retrieves the list of fonts currently served by the Google Fonts Developer API (webfonts.list)
	 *
	 * @param array $optParams Optional parameters.
	 *
	 * @opt_param string sort Enables sorting of the list
	 * @return Google_WebfontList
	 */
	/*
	public function listWebfonts($optParams = array()) {
		$params = array();
		$params = array_merge($params, $optParams);
		$data = $this->__call('list', array($params));
		if ($this->useObjects()) {
			return new Google_WebfontList($data);
		} else {
			return $data;
		}
	}
	*/
}

/**
 * Service definition for Google_Webfonts (v1).
 *
 * <p>
 * The Google Fonts Developer API.
 * </p>
 *
 * <p>
 * For more information about this service, see the
 * <a href="https://developers.google.com/fonts/docs/developer_api" target="_blank">API Documentation</a>
 * </p>
 *
 * @author Google, Inc.
 */
class Google_WebfontsService extends Google_Service {

	public $test;

	/**
	 * Constructs the internal representation of the Webfonts service.
	 *
	 * @param Google_Client $client
	 */
	public function __construct(Google_Client $client) {
//		$this->servicePath = 'webfonts/v1/';
		$this->servicePath = 'https://www.google.com/webmasters/tools/feeds/';
		$this->version = 'v1';
		$this->serviceName = 'webmasters';

		$client->addService($this->serviceName, $this->version);
		$this->test = new Google_Webmaster_Service_Resource($this, $this->serviceName, 'webmasters', json_decode('{"methods": {"list": {"id": "webfonts.webfonts.list", "path": "webfonts", "httpMethod": "GET", "parameters": {"sort": {"type": "string", "enum": ["alpha", "date", "popularity", "style", "trending"], "location": "query"}}, "response": {"$ref": "WebfontList"}}}}', true));

		var_dump( $this->test );

	}
}