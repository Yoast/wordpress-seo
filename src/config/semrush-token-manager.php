<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Empty_Token_Property_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Failed_Token_Storage_Exception;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;

/**
 * Class SEMrush_Token_Manager
 * @package Yoast\WP\SEO\Config
 */
class SEMrush_Token_Manager {

	const TOKEN_OPTION = 'yoast_semrush_tokens';

	/**
	 * @var SEMrush_Token
	 */
	private $token;

	/**
	 * Saves the tokens to storage.
	 *
	 * @return bool Whether or not the tokens were successfully saved.
	 * @throws SEMrush_Failed_Token_Storage_Exception
	 */
	public function store() {
		if ( empty( $this->token ) ) {
			throw new SEMrush_Failed_Token_Storage_Exception( 'No token was set' );
		}

		$saved = \update_option( self::TOKEN_OPTION, $this->token->to_array() );

		// Something went wrong in the saving process.
		if ( $saved === false ) {
			throw new SEMrush_Failed_Token_Storage_Exception();
		}

		return $saved;
	}

	/**
	 * Retrieves the tokens from storage.
	 *
	 * @return SEMrush_Token|null The tokens object. Returns null if none exist.
	 *
	 * @throws SEMrush_Empty_Token_Property_Exception
	 */
	public function get_from_storage() {
		$token = \get_option( self::TOKEN_OPTION );

		if ( ! is_array( $token ) || $token === null ) {
			return null;
		}

		$this->set_token(
			new SEMrush_Token(
				$token['access_token'],
				$token['refresh_token'],
				$token['expires'],
				$token['has_expired'],
				$token['created_at']
			)
		);

		return $this->token;
	}

	/**
	 * Gets the original token object.
	 *
	 * @return SEMrush_Token The token object.
	 */
	public function get_token() {
		return $this->token;
	}

	/**
	 * Sets the token that needs to be managed.
	 *
	 * @param SEMrush_Token $token The token to set.
	 */
	public function set_token( SEMrush_Token $token ) {
		$this->token = $token;
	}

	/**
	 * Creates and validates a new token instance from the passed response.
	 *
	 * @param AccessTokenInterface $response The response to use to create a new token from.
	 *
	 * @throws SEMrush_Empty_Token_Property_Exception
	 * @throws SEMrush_Failed_Token_Storage_Exception
	 */
	public function from_response( AccessTokenInterface $response ) {
		$token = SEMrush_Token::from_response( $response );

		$this->set_token( $token );
		$this->store();
	}
}
