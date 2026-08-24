<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Score_Updater;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Score_Update;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers the route that persists the per-field scores the bulk editor computes after a save.
 */
class Scores_Route implements Route_Interface {

	use No_Conditionals;

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
	public const ROUTE_PREFIX = '/bulk_editor/update_scores';

	/**
	 * The request field carrying the SEO title score.
	 *
	 * @var string
	 */
	private const SEO_TITLE_SCORE_FIELD = 'seo_title_score';

	/**
	 * The request field carrying the meta description score.
	 *
	 * @var string
	 */
	private const META_DESCRIPTION_SCORE_FIELD = 'meta_description_score';

	/**
	 * The lowest score a field can carry.
	 *
	 * @var int
	 */
	private const MIN_SCORE = 0;

	/**
	 * The highest score a field can carry.
	 *
	 * @var int
	 */
	private const MAX_SCORE = 100;

	/**
	 * The score updater.
	 *
	 * @var Score_Updater
	 */
	private $score_updater;

	/**
	 * The constructor.
	 *
	 * @param Score_Updater $score_updater The score updater.
	 */
	public function __construct( Score_Updater $score_updater ) {
		$this->score_updater = $score_updater;
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
					'items' => [
						'required'          => true,
						'type'              => 'array',
						'description'       => 'The per-post score updates to apply.',
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
	 * Validates the items argument.
	 *
	 * @param mixed $items The items argument value.
	 *
	 * @return true|WP_Error True when valid, a WP_Error otherwise.
	 */
	public function validate_items( $items ) {
		if ( ! \is_array( $items ) ) {
			return $this->reject( 'rest_invalid_items', 'The items argument must be an array.' );
		}

		$count = \count( $items );

		if ( $count < 1 ) {
			return $this->reject( 'rest_no_items', 'A batch must contain at least one item.' );
		}

		if ( ! Batch_Limit::is_within_limit( $count ) ) {
			return $this->reject(
				'rest_too_many_items',
				\sprintf( 'A batch may contain at most %d items.', Batch_Limit::MAX_ITEMS ),
			);
		}

		foreach ( $items as $item ) {
			$error = $this->validate_item( $item );
			if ( $error !== true ) {
				return $error;
			}
		}

		return true;
	}

	/**
	 * Validates a single item.
	 *
	 * @param mixed $item The item to validate.
	 *
	 * @return true|WP_Error True when valid, a WP_Error otherwise.
	 */
	private function validate_item( $item ) {
		if ( ! \is_array( $item ) ) {
			return $this->reject( 'rest_invalid_item', 'Each item must be an object.' );
		}

		if ( ! \array_key_exists( 'id', $item ) || ! \is_int( $item['id'] ) ) {
			return $this->reject( 'rest_invalid_item_id', 'Each item must contain an integer id.' );
		}

		$has_seo_title        = \array_key_exists( self::SEO_TITLE_SCORE_FIELD, $item );
		$has_meta_description = \array_key_exists( self::META_DESCRIPTION_SCORE_FIELD, $item );

		if ( ! $has_seo_title && ! $has_meta_description ) {
			return $this->reject(
				'rest_no_scores_to_update',
				\sprintf( 'Each item must contain a %s or a %s.', self::SEO_TITLE_SCORE_FIELD, self::META_DESCRIPTION_SCORE_FIELD ),
			);
		}

		foreach ( [ self::SEO_TITLE_SCORE_FIELD, self::META_DESCRIPTION_SCORE_FIELD ] as $field ) {
			if ( \array_key_exists( $field, $item ) && ! $this->is_valid_score( $item[ $field ] ) ) {
				return $this->reject(
					'rest_invalid_item_score',
					\sprintf( 'The %s field must be an integer between %d and %d.', $field, self::MIN_SCORE, self::MAX_SCORE ),
				);
			}
		}

		return true;
	}

	/**
	 * Whether the given value is a valid score.
	 *
	 * @param mixed $value The value to check.
	 *
	 * @return bool Whether the value is an integer within the allowed range.
	 */
	private function is_valid_score( $value ): bool {
		return \is_int( $value ) && $value >= self::MIN_SCORE && $value <= self::MAX_SCORE;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Builds the matching error response.
	 *
	 * @param string $code    The error code.
	 * @param string $message The human-readable error message.
	 *
	 * @return WP_Error The error response with a 400 status.
	 */
	private function reject( string $code, string $message ): WP_Error {
		return new WP_Error( $code, $message, [ 'status' => 400 ] );
	}

	/**
	 * Checks whether the current user is allowed to use the bulk editor.
	 *
	 * @return bool Whether the current user is allowed to use the bulk editor.
	 */
	public function check_permissions(): bool {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Applies the requested score updates.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The per-item results of the update.
	 */
	public function update( WP_REST_Request $request ): WP_REST_Response {
		$updates = [];

		foreach ( $request->get_param( 'items' ) as $item ) {
			$updates[] = new Post_Score_Update(
				(int) $item['id'],
				( \array_key_exists( self::SEO_TITLE_SCORE_FIELD, $item ) ) ? (int) $item[ self::SEO_TITLE_SCORE_FIELD ] : null,
				( \array_key_exists( self::META_DESCRIPTION_SCORE_FIELD, $item ) ) ? (int) $item[ self::META_DESCRIPTION_SCORE_FIELD ] : null,
			);
		}

		return new WP_REST_Response( $this->score_updater->update( $updates )->to_array() );
	}
}
