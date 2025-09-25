<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_HTTP_Request\Application;

use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;

/**
 * Class Request_Handler
 * Handles the request to Yoast AI API.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 *
 * @makePublic
 */
class Request_Handler implements Request_Handler_Interface {

	private const TIMEOUT = 60;

	/**
	 * The API client.
	 *
	 * @var API_Client
	 */
	private $api_client;

	/**
	 * The response parser.
	 *
	 * @var Response_Parser
	 */
	private $response_parser;

	/**
	 * Request_Handler constructor.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param API_Client      $api_client      The API client.
	 * @param Response_Parser $response_parser The response parser.
	 */
	public function __construct( API_Client $api_client, Response_Parser $response_parser ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler::__construct' );
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Executes the request to the API.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param Request $request The request to execute.
	 *
	 * @return Response The response from the API.
	 *
	 * @throws Bad_Request_Exception When the request fails for any other reason.
	 * @throws Forbidden_Exception When the response code is 403.
	 * @throws Internal_Server_Error_Exception When the response code is 500.
	 * @throws Not_Found_Exception When the response code is 404.
	 * @throws Payment_Required_Exception When the response code is 402.
	 * @throws Request_Timeout_Exception When the response code is 408.
	 * @throws Service_Unavailable_Exception When the response code is 503.
	 * @throws Too_Many_Requests_Exception When the response code is 429.
	 * @throws Unauthorized_Exception When the response code is 401.
	 * @throws WP_Request_Exception When the request fails for any other reason.
	 */
	public function handle( Request $request ): Response {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler::handle' );

		return new Response( '', 200, '' );
	}

		// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
}
