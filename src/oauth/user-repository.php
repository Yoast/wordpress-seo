<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface {

	public function getUserEntityByUserCredentials( $username, $password, $grantType, ClientEntityInterface $clientEntity ) {

	}
}
