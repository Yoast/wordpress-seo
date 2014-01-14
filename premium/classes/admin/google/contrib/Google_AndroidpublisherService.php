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
   * The "inapppurchases" collection of methods.
   * Typical usage is:
   *  <code>
   *   $androidpublisherService = new Google_AndroidPublisherService(...);
   *   $inapppurchases = $androidpublisherService->inapppurchases;
   *  </code>
   */
  class Google_InapppurchasesServiceResource extends Google_ServiceResource {

    /**
     * Checks the purchase and consumption status of an inapp item. (inapppurchases.get)
     *
     * @param string $packageName The package name of the application the inapp product was sold in (for example, 'com.some.thing').
     * @param string $productId The inapp product SKU (for example, 'com.some.thing.inapp1').
     * @param string $token The token provided to the user's device when the inapp product was purchased.
     * @param array $optParams Optional parameters.
     * @return Google_InappPurchase
     */
    public function get($packageName, $productId, $token, $optParams = array()) {
      $params = array('packageName' => $packageName, 'productId' => $productId, 'token' => $token);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_InappPurchase($data);
      } else {
        return $data;
      }
    }
  }

  /**
   * The "purchases" collection of methods.
   * Typical usage is:
   *  <code>
   *   $androidpublisherService = new Google_AndroidPublisherService(...);
   *   $purchases = $androidpublisherService->purchases;
   *  </code>
   */
  class Google_PurchasesServiceResource extends Google_ServiceResource {

    /**
     * Cancels a user's subscription purchase. The subscription remains valid until its expiration time.
     * (purchases.cancel)
     *
     * @param string $packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
     * @param string $subscriptionId The purchased subscription ID (for example, 'monthly001').
     * @param string $token The token provided to the user's device when the subscription was purchased.
     * @param array $optParams Optional parameters.
     */
    public function cancel($packageName, $subscriptionId, $token, $optParams = array()) {
      $params = array('packageName' => $packageName, 'subscriptionId' => $subscriptionId, 'token' => $token);
      $params = array_merge($params, $optParams);
      $data = $this->__call('cancel', array($params));
      return $data;
    }
    /**
     * Checks whether a user's subscription purchase is valid and returns its expiry time.
     * (purchases.get)
     *
     * @param string $packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
     * @param string $subscriptionId The purchased subscription ID (for example, 'monthly001').
     * @param string $token The token provided to the user's device when the subscription was purchased.
     * @param array $optParams Optional parameters.
     * @return Google_SubscriptionPurchase
     */
    public function get($packageName, $subscriptionId, $token, $optParams = array()) {
      $params = array('packageName' => $packageName, 'subscriptionId' => $subscriptionId, 'token' => $token);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_SubscriptionPurchase($data);
      } else {
        return $data;
      }
    }
  }

/**
 * Service definition for Google_AndroidPublisher (v1.1).
 *
 * <p>
 * Lets Android application developers access their Google Play accounts.
 * </p>
 *
 * <p>
 * For more information about this service, see the
 * <a href="https://developers.google.com/android-publisher" target="_blank">API Documentation</a>
 * </p>
 *
 * @author Google, Inc.
 */
class Google_AndroidPublisherService extends Google_Service {
  public $inapppurchases;
  public $purchases;
  /**
   * Constructs the internal representation of the AndroidPublisher service.
   *
   * @param Google_Client $client
   */
  public function __construct(Google_Client $client) {
    $this->servicePath = 'androidpublisher/v1.1/applications/';
    $this->version = 'v1.1';
    $this->serviceName = 'androidpublisher';

    $client->addService($this->serviceName, $this->version);
    $this->inapppurchases = new Google_InapppurchasesServiceResource($this, $this->serviceName, 'inapppurchases', json_decode('{"methods": {"get": {"id": "androidpublisher.inapppurchases.get", "path": "{packageName}/inapp/{productId}/purchases/{token}", "httpMethod": "GET", "parameters": {"packageName": {"type": "string", "required": true, "location": "path"}, "productId": {"type": "string", "required": true, "location": "path"}, "token": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "InappPurchase"}}}}', true));
    $this->purchases = new Google_PurchasesServiceResource($this, $this->serviceName, 'purchases', json_decode('{"methods": {"cancel": {"id": "androidpublisher.purchases.cancel", "path": "{packageName}/subscriptions/{subscriptionId}/purchases/{token}/cancel", "httpMethod": "POST", "parameters": {"packageName": {"type": "string", "required": true, "location": "path"}, "subscriptionId": {"type": "string", "required": true, "location": "path"}, "token": {"type": "string", "required": true, "location": "path"}}}, "get": {"id": "androidpublisher.purchases.get", "path": "{packageName}/subscriptions/{subscriptionId}/purchases/{token}", "httpMethod": "GET", "parameters": {"packageName": {"type": "string", "required": true, "location": "path"}, "subscriptionId": {"type": "string", "required": true, "location": "path"}, "token": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "SubscriptionPurchase"}}}}', true));

  }
}



class Google_InappPurchase extends Google_Model {
  public $consumptionState;
  public $developerPayload;
  public $kind;
  public $purchaseState;
  public $purchaseTime;
  public function setConsumptionState( $consumptionState) {
    $this->consumptionState = $consumptionState;
  }
  public function getConsumptionState() {
    return $this->consumptionState;
  }
  public function setDeveloperPayload( $developerPayload) {
    $this->developerPayload = $developerPayload;
  }
  public function getDeveloperPayload() {
    return $this->developerPayload;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setPurchaseState( $purchaseState) {
    $this->purchaseState = $purchaseState;
  }
  public function getPurchaseState() {
    return $this->purchaseState;
  }
  public function setPurchaseTime( $purchaseTime) {
    $this->purchaseTime = $purchaseTime;
  }
  public function getPurchaseTime() {
    return $this->purchaseTime;
  }
}

class Google_SubscriptionPurchase extends Google_Model {
  public $autoRenewing;
  public $initiationTimestampMsec;
  public $kind;
  public $validUntilTimestampMsec;
  public function setAutoRenewing( $autoRenewing) {
    $this->autoRenewing = $autoRenewing;
  }
  public function getAutoRenewing() {
    return $this->autoRenewing;
  }
  public function setInitiationTimestampMsec( $initiationTimestampMsec) {
    $this->initiationTimestampMsec = $initiationTimestampMsec;
  }
  public function getInitiationTimestampMsec() {
    return $this->initiationTimestampMsec;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setValidUntilTimestampMsec( $validUntilTimestampMsec) {
    $this->validUntilTimestampMsec = $validUntilTimestampMsec;
  }
  public function getValidUntilTimestampMsec() {
    return $this->validUntilTimestampMsec;
  }
}
