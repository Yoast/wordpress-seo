<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Application service for cleaning up all MyYoast client data.
 *
 * Orchestrates deregistration, token deletion, and local data cleanup.
 * Used by the uninstall integration to cleanly remove all plugin state.
 */
class MyYoast_Client_Cleanup implements LoggerAwareInterface {
	use LoggerAwareTrait;

	/**
	 * The client registration port.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * The site-level token storage port.
	 *
	 * @var Token_Storage_Interface
	 */
	private $token_storage;

	/**
	 * The user-level token storage port.
	 *
	 * @var User_Token_Storage_Interface
	 */
	private $user_token_storage;

	/**
	 * MyYoast_Client_Cleanup constructor.
	 *
	 * @param Client_Registration_Interface $client_registration The client registration port.
	 * @param Token_Storage_Interface       $token_storage       The site-level token storage port.
	 * @param User_Token_Storage_Interface  $user_token_storage  The user-level token storage port.
	 */
	public function __construct(
		Client_Registration_Interface $client_registration,
		Token_Storage_Interface $token_storage,
		User_Token_Storage_Interface $user_token_storage
	) {
		$this->client_registration = $client_registration;
		$this->token_storage       = $token_storage;
		$this->user_token_storage  = $user_token_storage;
		$this->logger              = new NullLogger();
	}

	/**
	 * Executes the full cleanup: deregister, delete tokens, delete local data.
	 *
	 * @return void
	 */
	public function execute(): void {
		// Best-effort server-side deregistration.
		try {
			$this->client_registration->deregister();
		}
		catch ( Exception $e ) {
			$this->logger->warning( 'MyYoast client deregistration failed during cleanup: {error}', [ 'error' => $e->getMessage() ] );
		}

		$this->user_token_storage->delete_all();
		$this->token_storage->delete();
		$this->client_registration->delete_local_data();
	}
}
