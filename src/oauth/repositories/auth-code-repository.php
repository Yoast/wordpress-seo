<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Auth_Token;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\AuthCodeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface;
use Yoast\WP\Lib\Model;

class AuthCodeRepository implements AuthCodeRepositoryInterface {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Auth_Token' );
	}

	public function getNewAuthCode() {
		return new Auth_Token();
	}

	public function persistNewAuthCode( AuthCodeEntityInterface $authCodeEntity ) {
		$this->query()->create(
			[
				"identifier" => $authCodeEntity->getIdentifier(),
				"expiry_date_time" => $authCodeEntity->getExpiryDateTime()->format("Y-m-d H:i:s"),
				"user_identifier" => $authCodeEntity->getUserIdentifier(),
				"scopes" => implode( ',', $authCodeEntity->getScopes() ),
				"client_identifier" => $authCodeEntity->getClient()->getIdentifier(),
			]
		)->save();
	}

	public function revokeAuthCode( $codeId ) {
		$this->query()->where('identifier', $codeId)->delete_many();
	}

	public function isAuthCodeRevoked( $codeId ) {
		return $this->query()->where("identifier", $codeId)->where_gt("expiry_date_time", (new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"))->count() === 0;
	}
}
