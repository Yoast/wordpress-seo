<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\User_Interface;

use RuntimeException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get a content outline from the AI API.
 *
 * @internal This route powers the Yoast SEO admin UI's Content Planner feature. It is not part of the plugin's public REST API surface, requires the `edit_posts` capability (see {@see self::check_permissions()}), and may change at any time without notice.
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Get_Outline_Route implements Route_Interface {

	/**
	 * The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/ai_content_planner/get_outline';

	/**
	 * The command handler instance.
	 *
	 * @var Content_Outline_Command_Handler
	 */
	private $command_handler;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param Content_Outline_Command_Handler $command_handler The command handler instance.
	 */
	public function __construct( Content_Outline_Command_Handler $command_handler ) {
		$this->command_handler = $command_handler;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				'methods'             => 'POST',
				'args'                => [
					'post_type'        => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The post type to get a content outline for.',
					],
					'language'         => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The language the content is written in.',
					],
					'editor'           => [
						'required'    => true,
						'type'        => 'string',
						'enum'        => [
							'classic',
							'elementor',
							'gutenberg',
						],
						'description' => 'The current editor.',
					],
					'title'            => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The title of the chosen content suggestion.',
					],
					'intent'           => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The intent of the chosen content suggestion.',
					],
					'explanation'      => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The explanation of the chosen content suggestion.',
					],
					'keyphrase'        => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The keyphrase of the chosen content suggestion.',
					],
					'meta_description' => [
						'required'    => true,
						'type'        => 'string',
						'description' => 'The meta description of the chosen content suggestion.',
					],
					'category'         => [
						'required'    => true,
						'type'        => 'object',
						'properties'  => [
							'name' => [
								'type'     => 'string',
								'required' => true,
							],
							'id'   => [
								'type'     => 'integer',
								'required' => true,
							],
						],
						'description' => 'The category of the chosen content suggestion. Use name "" and id -1 to indicate no category.',
					],
				],
				'callback'            => [ $this, 'get_outline' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			],
		);
	}

	/**
	 * Runs the callback to get an AI-generated content outline.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the get_outline action.
	 */
	public function get_outline( WP_REST_Request $request ): WP_REST_Response {
		try {
			$user = \wp_get_current_user();

			$category_param = $request->get_param( 'category' );

			$command = new Content_Outline_Command(
				$user,
				$request->get_param( 'post_type' ),
				$request->get_param( 'language' ),
				$request->get_param( 'editor' ),
				$request->get_param( 'title' ),
				$request->get_param( 'intent' ),
				$request->get_param( 'explanation' ),
				$request->get_param( 'keyphrase' ),
				$request->get_param( 'meta_description' ),
				$category_param['name'],
				(int) $category_param['id'],
			);
			$data    = $this->command_handler->handle( $command );
		} catch ( Remote_Request_Exception $e ) {
			$message = [
				'message'         => $e->getMessage(),
				'errorIdentifier' => $e->get_error_identifier(),
			];
			if ( $e instanceof Payment_Required_Exception || $e instanceof Too_Many_Requests_Exception ) {
				$message['missingLicenses'] = $e->get_missing_licenses();
			}
			return new WP_REST_Response(
				$message,
				$e->getCode(),
			);
		} catch ( RuntimeException $e ) {
			return new WP_REST_Response( 'Failed to get content outline.', 500 );
		}

		return new WP_REST_Response( $data->to_array() );
	}

	/**
	 * Checks if the user is logged in and can edit posts.
	 *
	 * @return bool Whether the user is logged in and can edit posts.
	 */
	public function check_permissions(): bool {
		$user = \wp_get_current_user();
		if ( $user === null || $user->ID < 1 ) {
			return false;
		}

		return \user_can( $user, 'edit_posts' );
	}
}
