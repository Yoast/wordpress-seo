<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route that applies a batch of per-post title and description updates.
 */
abstract class Abstract_Bulk_Update_Route implements Route_Interface {

	/**
	 * The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The bulk updater.
	 *
	 * @var Bulk_Updater
	 */
	private $bulk_updater;

	/**
	 * The constructor.
	 *
	 * @param Bulk_Updater $bulk_updater The bulk updater.
	 */
	public function __construct( Bulk_Updater $bulk_updater ) {
		$this->bulk_updater = $bulk_updater;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Gets the appearance this route updates.
	 *
	 * @return Update_Type The appearance this route updates.
	 */
	abstract protected function get_update_type(): Update_Type;

	/**
	 * Gets the prefix for this route.
	 *
	 * @return string The prefix for this route.
	 */
	abstract protected function get_route_prefix(): string;

	/**
	 * Gets the name of the title argument in the request.
	 *
	 * @return string The name of the title argument.
	 */
	abstract protected function get_title_arg_name(): string;

	/**
	 * Gets the name of the description argument in the request.
	 *
	 * @return string The name of the description argument.
	 */
	abstract protected function get_description_arg_name(): string;

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			$this->get_route_prefix(),
			[
				'methods'             => 'POST',
				'args'                => [
					'items' => [
						'required'          => true,
						'type'              => 'array',
						'description'       => 'The per-post updates to apply.',
						'minItems'          => 1,
						'maxItems'          => Batch_Limit::MAX_ITEMS,
						'items'             => [
							'type'                 => 'object',
							'additionalProperties' => false,
							'properties'           => [
								'id' => [
									'type'        => 'integer',
									'required'    => true,
									'minimum'     => 1,
									'description' => 'The ID of the post to update.',
								],
								$this->get_title_arg_name() => [
									'type'        => 'string',
									'description' => 'The new title for the post.',
								],
								$this->get_description_arg_name() => [
									'type'        => 'string',
									'description' => 'The new description for the post.',
								],
							],
						],
						'validate_callback' => [ $this, 'validate_items' ],
					],
				],
				'callback'            => [ $this, 'update' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			],
		);
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The validate callback receives whatever the client sent.

	/**
	 * Validates the items argument on top of the schema validation.
	 *
	 * @param mixed $items The items argument value.
	 *
	 * @return true|WP_Error True when valid, a WP_Error otherwise.
	 */
	public function validate_items( $items ) {
		if ( ! \is_array( $items ) ) {
			return new WP_Error( 'rest_invalid_items', 'The items argument must be an array.', [ 'status' => 400 ] );
		}

		if ( ! Batch_Limit::is_within_limit( \count( $items ) ) ) {
			return new WP_Error(
				'rest_too_many_items',
				\sprintf( 'A batch may contain at most %d items.', Batch_Limit::MAX_ITEMS ),
				[ 'status' => 400 ],
			);
		}

		foreach ( $items as $item ) {
			if ( ! \is_array( $item )
				|| ( ! \array_key_exists( $this->get_title_arg_name(), $item )
					&& ! \array_key_exists( $this->get_description_arg_name(), $item ) )
			) {
				return new WP_Error(
					'rest_no_fields_to_update',
					\sprintf( 'Each item must contain at least a %s or a %s.', $this->get_title_arg_name(), $this->get_description_arg_name() ),
					[ 'status' => 400 ],
				);
			}
		}

		return true;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Checks whether the current user is allowed to use the bulk editor.
	 *
	 * @return bool Whether the current user is allowed to use the bulk editor.
	 */
	public function check_permissions(): bool {
		return \current_user_can( 'wpseo_bulk_edit' );
	}

	/**
	 * Runs the callback that applies the requested updates.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The per-item results of the update.
	 */
	public function update( WP_REST_Request $request ): WP_REST_Response {
		$updates = new Post_Update_Collection();

		foreach ( $request->get_param( 'items' ) as $item ) {
			$updates->add(
				new Post_Update(
					(int) $item['id'],
					// Use array_key_exists, not isset: an empty string is a value that clears the field.
					( \array_key_exists( $this->get_title_arg_name(), $item ) ) ? (string) $item[ $this->get_title_arg_name() ] : null,
					( \array_key_exists( $this->get_description_arg_name(), $item ) ) ? (string) $item[ $this->get_description_arg_name() ] : null,
				),
			);
		}

		$results = $this->bulk_updater->update( $this->get_update_type(), $updates );

		return new WP_REST_Response( $results->to_array() );
	}
}
