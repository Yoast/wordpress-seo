<?php
/*
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


  /**
   * The "webResource" collection of methods.
   * Typical usage is:
   *  <code>
   *   $siteVerificationService = new Google_SiteVerificationService(...);
   *   $webResource = $siteVerificationService->webResource;
   *  </code>
   */
  class Google_WebResourceServiceResource extends Google_ServiceResource {

    /**
     * Relinquish ownership of a website or domain. (webResource.delete)
     *
     * @param string $id The id of a verified site or domain.
     * @param array $optParams Optional parameters.
     */
    public function delete($id, $optParams = array()) {
      $params = array('id' => $id);
      $params = array_merge($params, $optParams);
      $data = $this->__call('delete', array($params));
      return $data;
    }
    /**
     * Get the most current data for a website or domain. (webResource.get)
     *
     * @param string $id The id of a verified site or domain.
     * @param array $optParams Optional parameters.
     * @return Google_SiteVerificationWebResourceResource
     */
    public function get($id, $optParams = array()) {
      $params = array('id' => $id);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_SiteVerificationWebResourceResource($data);
      } else {
        return $data;
      }
    }
    /**
     * Get a verification token for placing on a website or domain. (webResource.getToken)
     *
     * @param Google_SiteVerificationWebResourceGettokenRequest $postBody
     * @param array $optParams Optional parameters.
     * @return Google_SiteVerificationWebResourceGettokenResponse
     */
    public function getToken(Google_SiteVerificationWebResourceGettokenRequest $postBody, $optParams = array()) {
      $params = array('postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('getToken', array($params));
      if ($this->useObjects()) {
        return new Google_SiteVerificationWebResourceGettokenResponse($data);
      } else {
        return $data;
      }
    }
    /**
     * Attempt verification of a website or domain. (webResource.insert)
     *
     * @param string $verificationMethod The method to use for verifying a site or domain.
     * @param Google_SiteVerificationWebResourceResource $postBody
     * @param array $optParams Optional parameters.
     * @return Google_SiteVerificationWebResourceResource
     */
    public function insert($verificationMethod, Google_SiteVerificationWebResourceResource $postBody, $optParams = array()) {
      $params = array('verificationMethod' => $verificationMethod, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('insert', array($params));
      if ($this->useObjects()) {
        return new Google_SiteVerificationWebResourceResource($data);
      } else {
        return $data;
      }
    }
    /**
     * Get the list of your verified websites and domains. (webResource.list)
     *
     * @param array $optParams Optional parameters.
     * @return Google_SiteVerificationWebResourceListResponse
     */
    public function listWebResource($optParams = array()) {
      $params = array();
      $params = array_merge($params, $optParams);
      $data = $this->__call('list', array($params));
      if ($this->useObjects()) {
        return new Google_SiteVerificationWebResourceListResponse($data);
      } else {
        return $data;
      }
    }
    /**
     * Modify the list of owners for your website or domain. This method supports patch semantics.
     * (webResource.patch)
     *
     * @param string $id The id of a verified site or domain.
     * @param Google_SiteVerificationWebResourceResource $postBody
     * @param array $optParams Optional parameters.
     * @return Google_SiteVerificationWebResourceResource
     */
    public function patch($id, Google_SiteVerificationWebResourceResource $postBody, $optParams = array()) {
      $params = array('id' => $id, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('patch', array($params));
      if ($this->useObjects()) {
        return new Google_SiteVerificationWebResourceResource($data);
      } else {
        return $data;
      }
    }
    /**
     * Modify the list of owners for your website or domain. (webResource.update)
     *
     * @param string $id The id of a verified site or domain.
     * @param Google_SiteVerificationWebResourceResource $postBody
     * @param array $optParams Optional parameters.
     * @return Google_SiteVerificationWebResourceResource
     */
    public function update($id, Google_SiteVerificationWebResourceResource $postBody, $optParams = array()) {
      $params = array('id' => $id, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('update', array($params));
      if ($this->useObjects()) {
        return new Google_SiteVerificationWebResourceResource($data);
      } else {
        return $data;
      }
    }
  }

/**
 * Service definition for Google_SiteVerification (v1).
 *
 * <p>
 * Lets you programatically verify ownership of websites or domains with Google.
 * </p>
 *
 * <p>
 * For more information about this service, see the
 * <a href="https://developers.google.com/site-verification/" target="_blank">API Documentation</a>
 * </p>
 *
 * @author Google, Inc.
 */
class Google_SiteVerificationService extends Google_Service {
  public $webResource;
  /**
   * Constructs the internal representation of the SiteVerification service.
   *
   * @param Google_Client $client
   */
  public function __construct(Google_Client $client) {
    $this->servicePath = 'siteVerification/v1/';
    $this->version = 'v1';
    $this->serviceName = 'siteVerification';

    $client->addService($this->serviceName, $this->version);
    $this->webResource = new Google_WebResourceServiceResource($this, $this->serviceName, 'webResource', json_decode('{"methods": {"delete": {"id": "siteVerification.webResource.delete", "path": "webResource/{id}", "httpMethod": "DELETE", "parameters": {"id": {"type": "string", "required": true, "location": "path"}}, "scopes": ["https://www.googleapis.com/auth/siteverification"]}, "get": {"id": "siteVerification.webResource.get", "path": "webResource/{id}", "httpMethod": "GET", "parameters": {"id": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "SiteVerificationWebResourceResource"}, "scopes": ["https://www.googleapis.com/auth/siteverification"]}, "getToken": {"id": "siteVerification.webResource.getToken", "path": "token", "httpMethod": "POST", "request": {"$ref": "SiteVerificationWebResourceGettokenRequest"}, "response": {"$ref": "SiteVerificationWebResourceGettokenResponse"}, "scopes": ["https://www.googleapis.com/auth/siteverification", "https://www.googleapis.com/auth/siteverification.verify_only"]}, "insert": {"id": "siteVerification.webResource.insert", "path": "webResource", "httpMethod": "POST", "parameters": {"verificationMethod": {"type": "string", "required": true, "location": "query"}}, "request": {"$ref": "SiteVerificationWebResourceResource"}, "response": {"$ref": "SiteVerificationWebResourceResource"}, "scopes": ["https://www.googleapis.com/auth/siteverification", "https://www.googleapis.com/auth/siteverification.verify_only"]}, "list": {"id": "siteVerification.webResource.list", "path": "webResource", "httpMethod": "GET", "response": {"$ref": "SiteVerificationWebResourceListResponse"}, "scopes": ["https://www.googleapis.com/auth/siteverification"]}, "patch": {"id": "siteVerification.webResource.patch", "path": "webResource/{id}", "httpMethod": "PATCH", "parameters": {"id": {"type": "string", "required": true, "location": "path"}}, "request": {"$ref": "SiteVerificationWebResourceResource"}, "response": {"$ref": "SiteVerificationWebResourceResource"}, "scopes": ["https://www.googleapis.com/auth/siteverification"]}, "update": {"id": "siteVerification.webResource.update", "path": "webResource/{id}", "httpMethod": "PUT", "parameters": {"id": {"type": "string", "required": true, "location": "path"}}, "request": {"$ref": "SiteVerificationWebResourceResource"}, "response": {"$ref": "SiteVerificationWebResourceResource"}, "scopes": ["https://www.googleapis.com/auth/siteverification"]}}}', true));

  }
}



class Google_SiteVerificationWebResourceGettokenRequest extends Google_Model {
  protected $__siteType = 'Google_SiteVerificationWebResourceGettokenRequestSite';
  protected $__siteDataType = '';
  public $site;
  public $verificationMethod;
  public function setSite(Google_SiteVerificationWebResourceGettokenRequestSite $site) {
    $this->site = $site;
  }
  public function getSite() {
    return $this->site;
  }
  public function setVerificationMethod( $verificationMethod) {
    $this->verificationMethod = $verificationMethod;
  }
  public function getVerificationMethod() {
    return $this->verificationMethod;
  }
}

class Google_SiteVerificationWebResourceGettokenRequestSite extends Google_Model {
  public $identifier;
  public $type;
  public function setIdentifier( $identifier) {
    $this->identifier = $identifier;
  }
  public function getIdentifier() {
    return $this->identifier;
  }
  public function setType( $type) {
    $this->type = $type;
  }
  public function getType() {
    return $this->type;
  }
}

class Google_SiteVerificationWebResourceGettokenResponse extends Google_Model {
  public $method;
  public $token;
  public function setMethod( $method) {
    $this->method = $method;
  }
  public function getMethod() {
    return $this->method;
  }
  public function setToken( $token) {
    $this->token = $token;
  }
  public function getToken() {
    return $this->token;
  }
}

class Google_SiteVerificationWebResourceListResponse extends Google_Model {
  protected $__itemsType = 'Google_SiteVerificationWebResourceResource';
  protected $__itemsDataType = 'array';
  public $items;
  public function setItems(/* array(Google_SiteVerificationWebResourceResource) */ $items) {
    $this->assertIsArray($items, 'Google_SiteVerificationWebResourceResource', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
}

class Google_SiteVerificationWebResourceResource extends Google_Model {
  public $id;
  public $owners;
  protected $__siteType = 'Google_SiteVerificationWebResourceResourceSite';
  protected $__siteDataType = '';
  public $site;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setOwners(/* array(Google_string) */ $owners) {
    $this->assertIsArray($owners, 'Google_string', __METHOD__);
    $this->owners = $owners;
  }
  public function getOwners() {
    return $this->owners;
  }
  public function setSite(Google_SiteVerificationWebResourceResourceSite $site) {
    $this->site = $site;
  }
  public function getSite() {
    return $this->site;
  }
}

class Google_SiteVerificationWebResourceResourceSite extends Google_Model {
  public $identifier;
  public $type;
  public function setIdentifier( $identifier) {
    $this->identifier = $identifier;
  }
  public function getIdentifier() {
    return $this->identifier;
  }
  public function setType( $type) {
    $this->type = $type;
  }
  public function getType() {
    return $this->type;
  }
}
