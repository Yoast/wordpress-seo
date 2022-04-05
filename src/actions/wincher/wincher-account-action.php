<?php

namespace Yoast\WP\SEO\Actions\Wincher;

use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Wincher_Account_Action
 */
class Wincher_Account_Action {

	const ACCOUNT_URL = 'https://api.wincher.com/beta/account';

	/**
	 * The Wincher_Client instance.
	 *
	 * @var Wincher_Client
	 */
	protected $client;

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Wincher_Account_Action constructor.
	 *
	 * @param Wincher_Client $client         The API client.
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Wincher_Client $client, Options_Helper $options_helper ) {
		$this->client         = $client;
		$this->options_helper = $options_helper;
	}

	/**
	 * Checks the account limit for tracking keyphrases.
	 *
	 * @return object The response object.
	 */
	public function check_limit() {
		// Code has already been validated at this point. No need to do that again.
		try {
			$results = $this->client->get( self::ACCOUNT_URL );

			$usage = $results['limits']['keywords']['usage'];
			$limit = $results['limits']['keywords']['limit'];

			return (object) [
				'canTrack'  => \is_null( $limit ) || $usage < $limit,
				'limit'     => $limit,
				'usage'     => $usage,
				'status'    => 200,
			];
		} catch ( \Exception $e ) {
			return (object) [
				'status' => $e->getCode(),
				'error'  => $e->getMessage(),
			];
		}
	}
}
