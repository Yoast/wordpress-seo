<?php
/*
 * Copyright 2011 Google Inc.
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
 * Verifies signatures using PEM encoded certificates.
 *
 * @author Brian Eaton <beaton@google.com>
 */
class Google_PemVerifier extends Google_Verifier {
  private $publicKey;

  /**
   * Constructs a verifier from the supplied PEM-encoded certificate.
   *
   * $pem: a PEM encoded certificate (not a file).
   * @param $pem
   * @throws Google_AuthException
   * @throws Google_Exception
   */
  function __construct($pem) {
    if (!function_exists('openssl_x509_read')) {
      throw new Google_Exception('Google API PHP client needs the openssl PHP extension');
    }
    $this->publicKey = openssl_x509_read($pem);
    if (!$this->publicKey) {
      throw new Google_AuthException("Unable to parse PEM: $pem");
    }
  }

  function __destruct() {
    if ($this->publicKey) {
      openssl_x509_free($this->publicKey);
    }
  }

  /**
   * Verifies the signature on data.
   *
   * Returns true if the signature is valid, false otherwise.
   * @param $data
   * @param $signature
   * @throws Google_AuthException
   * @return bool
   */
  function verify($data, $signature) {
    $status = openssl_verify($data, $signature, $this->publicKey, "sha256");
    if ($status === -1) {
      throw new Google_AuthException('Signature verification error: ' . openssl_error_string());
    }
    return $status === 1;
  }
}
