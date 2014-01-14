<?php
/*
 * Copyright 2013 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Http Streams based implementation of Google_IO.
 *
 * @author Stuart Langley <slangley@google.com>
 */

require_once 'Google_CacheParser.php';

class Google_HttpStreamIO extends Google_IO {

  private static $ENTITY_HTTP_METHODS = array("POST" => null, "PUT" => null);

  private static $DEFAULT_HTTP_CONTEXT = array(
    "follow_location" => 0,
    "ignore_errors" => 1,
  );

  private static $DEFAULT_SSL_CONTEXT = array(
    "verify_peer" => true,
  );

  /**
   * Perform an authenticated / signed apiHttpRequest.
   * This function takes the apiHttpRequest, calls apiAuth->sign on it
   * (which can modify the request in what ever way fits the auth mechanism)
   * and then calls Google_HttpStreamIO::makeRequest on the signed request
   *
   * @param Google_HttpRequest $request
   * @return Google_HttpRequest The resulting HTTP response including the
   * responseHttpCode, responseHeaders and responseBody.
   */
  public function authenticatedRequest(Google_HttpRequest $request) {
    $request = Google_Client::$auth->sign($request);
    return $this->makeRequest($request);
  }

  /**
   * Execute a apiHttpRequest
   *
   * @param Google_HttpRequest $request the http request to be executed
   * @return Google_HttpRequest http request with the response http code,
   * response headers and response body filled in
   * @throws Google_IOException on curl or IO error
   */
  public function makeRequest(Google_HttpRequest $request) {
    // First, check to see if we have a valid cached version.
    $cached = $this->getCachedRequest($request);
    if ($cached !== false) {
      if (!$this->checkMustRevaliadateCachedRequest($cached, $request)) {
        return $cached;
      }
    }

    $default_options = stream_context_get_options(stream_context_get_default());

    $requestHttpContext = array_key_exists('http', $default_options) ?
        $default_options['http'] : array();
    if (array_key_exists($request->getRequestMethod(),
          self::$ENTITY_HTTP_METHODS)) {
      $request = $this->processEntityRequest($request);
    }

    if ($request->getPostBody()) {
      $requestHttpContext["content"] = $request->getPostBody();
    }

    $requestHeaders = $request->getRequestHeaders();
    if ($requestHeaders && is_array($requestHeaders)) {
      $headers = "";
      foreach($requestHeaders as $k => $v) {
        $headers .= "$k: $v\n";
      }
      $requestHttpContext["header"] = $headers;
    }

    $requestHttpContext["method"] = $request->getRequestMethod();
    $requestHttpContext["user_agent"] = $request->getUserAgent();

    $requestSslContext = array_key_exists('ssl', $default_options) ?
        $default_options['ssl'] : array();

    if (!array_key_exists("cafile", $requestSslContext)) {
      $requestSslContext["cafile"] = dirname(__FILE__) . '/cacerts.pem';
    }

    $options = array("http" => array_merge(self::$DEFAULT_HTTP_CONTEXT,
                                                 $requestHttpContext),
                     "ssl" => array_merge(self::$DEFAULT_SSL_CONTEXT,
                                          $requestSslContext));

    $context = stream_context_create($options);

    $response_data = file_get_contents($request->getUrl(),
                                       false,
                                       $context);

    if (false === $response_data) {
      throw new Google_IOException("HTTP Error: Unable to connect");
    }

    $respHttpCode = $this->getHttpResponseCode($http_response_header);
    $responseHeaders = $this->getHttpResponseHeaders($http_response_header);

    if ($respHttpCode == 304 && $cached) {
      // If the server responded NOT_MODIFIED, return the cached request.
      $this->updateCachedRequest($cached, $responseHeaders);
      return $cached;
    }

    $request->setResponseHttpCode($respHttpCode);
    $request->setResponseHeaders($responseHeaders);
    $request->setResponseBody($response_data);
    // Store the request in cache (the function checks to see if the request
    // can actually be cached)
    $this->setCachedRequest($request);
    return $request;
  }

  /**
   * Set options that update the transport implementation's behavior.
   * @param $options
   */
  public function setOptions($options) {
  }

  private function getHttpResponseCode($response_headers) {
    $header_count = count($response_headers);

    for ($i = 0; $i < $header_count; $i++) {
      $header = $response_headers[$i];
      if (strncasecmp("HTTP", $header, strlen("HTTP")) == 0) {
        $response = explode(' ', $header);
        return $response[1];
      }
    }
    return 'UNKNOWN';
  }

  private function getHttpResponseHeaders($response_headers) {
    $header_count = count($response_headers);
    $headers = array();

    for ($i = 0; $i < $header_count; $i++) {
      $header = $response_headers[$i];
      $header_parts = explode(':', $header);
      if (count($header_parts) == 2) {
        $headers[$header_parts[0]] = $header_parts[1];
      }
    }

    return $headers;
  }
}
