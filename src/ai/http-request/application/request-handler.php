<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\HTTP_Request\Application;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;

/**
 * Class Request_Handler
 * Handles the request to Yoast AI API for the legacy Token (JWT) auth path.
 *
 * @makePublic
 */
class Request_Handler implements Request_Handler_Interface {

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
	 * The response validator.
	 *
	 * @var Response_Validator
	 */
	private $response_validator;

	/**
	 * Request_Handler constructor.
	 *
	 * @param API_Client         $api_client         The API client.
	 * @param Response_Parser    $response_parser    The response parser.
	 * @param Response_Validator $response_validator The response validator.
	 */
	public function __construct( API_Client $api_client, Response_Parser $response_parser, Response_Validator $response_validator ) {
		$this->api_client         = $api_client;
		$this->response_parser    = $response_parser;
		$this->response_validator = $response_validator;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- The @throws list documents the exception family Response_Validator produces.

	/**
	 * Executes the request to the API.
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
	 * @throws WP_Request_Exception When wp_remote_request returns an error.
	 */
	public function handle( Request $request ): Response {
		$api_response = $this->api_client->perform_request(
			$request->get_action_path(),
			$request->get_body(),
			$request->get_headers(),
			$request->get_http_method(),
		);

		return $this->response_validator->assert_success( $this->response_parser->parse( $api_response ) );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
