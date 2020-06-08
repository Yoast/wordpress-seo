<?php namespace Yoast\WP\SEO\Config;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Expired_Token_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Empty_Token_Property_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Failed_Token_Storage_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;

/**
 * Class SEMrush_Token_Manager
 * @package Yoast\WP\SEO\Config
 */
class SEMrush_Token_Manager {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * @var SEMrush_Token
	 */
	private $token;

	/**
	 * SEMrush_Token_Manager constructor.
	 *
	 * @param Options_Helper $options_helper
	 *
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

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

		$saved = $this->options_helper->set(
			'yst_semrush_tokens',
			$this->token->to_array()
		);

		// Something went wrong in the saving process.
		if ( $saved === null || $saved === false ) {
			throw new SEMrush_Failed_Token_Storage_Exception();
		}

		return $saved;
	}

	/**
	 * Retrieves the tokens from storage.
	 *
	 * @return SEMrush_Token|null The tokens object. Returns null if none exist.
	 *
	 * @throws OAuth_Expired_Token_Exception
	 * @throws SEMrush_Empty_Token_Property_Exception
	 */
	public function get_from_storage() {
		$token = $this->options_helper->get( 'yst_semrush_tokens' );

		if ( ! is_array( $token ) || $token === null ) {
			return null;
		}

		$this->set_token(
			new SEMrush_Token(
				$token['access_token'],
				$token['refresh_token'],
				$token['expires'],
				$token['has_expired']
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
	 * @throws OAuth_Expired_Token_Exception
	 * @throws SEMrush_Empty_Token_Property_Exception
	 * @throws SEMrush_Failed_Token_Storage_Exception
	 */
	public function from_response( AccessTokenInterface $response ) {
		$token = SEMrush_Token::from_response( $response );

		$this->set_token( $token );
		$this->store();
	}
}
