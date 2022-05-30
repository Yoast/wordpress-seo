<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Auth_Token;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\AuthCodeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface;
use Yoast\WP\Lib\Model;

/**
 * Class Auth_Code_Repository.
 */
class Auth_Code_Repository implements AuthCodeRepositoryInterface {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Auth_Token' );
	}

	/**
	 * Get a fresh empty Auth_Token instance.
	 *
	 * @return Auth_Token
	 */
	public function getNewAuthCode() {
		return new Auth_Token();
	}

	/**
	 * Store an AuthCodeEntityInterface in the database.
	 *
	 * @param AuthCodeEntityInterface $authCodeEntity The auth code to store.
	 *
	 * @return void
	 * @throws \Exception When storing the auth code fails.
	 */
	public function persistNewAuthCode( AuthCodeEntityInterface $authCodeEntity ) {
		$this->query()->create(
			[
				'identifier'        => $authCodeEntity->getIdentifier(),
				'expiry_date_time'  => $authCodeEntity->getExpiryDateTime()->format( 'Y-m-d H:i:s' ),
				'user_identifier'   => $authCodeEntity->getUserIdentifier(),
				'scopes'            => implode( ',', $authCodeEntity->getScopes() ),
				'client_identifier' => $authCodeEntity->getClient()->getIdentifier(),
			]
		)->save();
	}

	/**
	 * Remove an auth code from the database.
	 *
	 * @param string $codeId The identifier of the auth code to remove from the database.
	 *
	 * @return void
	 */
	public function revokeAuthCode( $codeId ) {
		$this->query()->where( 'identifier', $codeId )->delete_many();
	}

	/**
	 * Check if an auth code is revoked.
	 *
	 * @param string $codeId The identifier of the auth code to check.
	 *
	 * @return bool true when the auth code is not found in the database, false otherwise.
	 */
	public function isAuthCodeRevoked( $codeId ) {
		return $this->query()->where( 'identifier', $codeId )->where_gt( 'expiry_date_time', ( new \DateTimeImmutable( 'now' ) )->format( 'Y-m-d H:i:s' ) )->count() === 0;
	}

	/**
	 * Remove all expired auth codes.
	 *
	 * @return void
	 */
	public function remove_expired() {
		$this->query()->where_lte( 'expiry_date_time', ( new \DateTimeImmutable( 'now' ) )->format( 'Y-m-d H:i:s' ) )->delete_many();
	}

	/**
	 * Remove all auth codes.
	 *
	 * @return void
	 */
	public function remove_all() {
		$this->query()->delete_many();
	}
}
