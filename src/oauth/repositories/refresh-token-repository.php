<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Refresh_Token;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\RefreshTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface;
use Yoast\WP\Lib\Model;

/**
 * Class Refresh_Token_Repository.
 */
class Refresh_Token_Repository implements RefreshTokenRepositoryInterface {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Refresh_Token' );
	}

	/**
	 * Get a fresh Refresh_Token.
	 *
	 * @return Refresh_Token
	 */
	public function getNewRefreshToken() {
		return new Refresh_Token();
	}

	/**
	 * Store a RefreshTokenEntityInterface in the database.
	 *
	 * @param RefreshTokenEntityInterface $refreshTokenEntity The refresh token to store.
	 *
	 * @return void
	 * @throws \Exception When storing the refresh token fails.
	 */
	public function persistNewRefreshToken( RefreshTokenEntityInterface $refreshTokenEntity ) {
		$this->query()->create(
			[
				'identifier'       => $refreshTokenEntity->getIdentifier(),
				'expiry_date_time' => $refreshTokenEntity->getExpiryDateTime()->format( 'Y-m-d H:i:s' ),
				'access_token'     => $refreshTokenEntity->getAccessToken()->getIdentifier(),
			]
		)->save();
	}

	/**
	 * Remove a refresh token from the database.
	 *
	 * @param string $tokenId The identifier of the refresh token to remove from the database.
	 *
	 * @return void
	 */
	public function revokeRefreshToken( $tokenId ) {
		$this->query()->where( 'identifier', $tokenId )->delete_many();
	}

	/**
	 * Check if a refresh token is revoked.
	 *
	 * @param string $tokenId The identifier of the refresh token to check.
	 *
	 * @return bool true when the refresh token is not found in the database, false otherwise.
	 */
	public function isRefreshTokenRevoked( $tokenId ) {
		return $this->query()->where( 'identifier', $tokenId )->where_gt( 'expiry_date_time', ( new \DateTimeImmutable( 'now' ) )->format( 'Y-m-d H:i:s' ) )->count() === 0;
	}

	/**
	 * Remove all expired refresh tokens.
	 *
	 * @return void
	 */
	public function remove_expired() {
		$this->query()->where_lte( 'expiry_date_time', ( new \DateTimeImmutable( 'now' ) )->format( 'Y-m-d H:i:s' ) )->delete_many();
	}

	/**
	 * Remove all refresh tokens.
	 *
	 * @return void
	 */
	public function remove_all() {
		$this->query()->delete_many();
	}
}
