<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WP_Error;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Resolves an author identifier (user ID or author archive permalink) into a user indexable.
 *
 * No user indexable is built while author archives are disabled, or for users excluded from them, like users
 * without posts when author archives without posts are set to noindex. The user profile still saves the SEO
 * settings of those users, so an unsaved indexable is resolved instead, for the settings to be saved all the same.
 */
class Author_Identifier_Resolver {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Resolves the input to exactly one user indexable.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing one of 'user_id' or 'permalink'.
	 *
	 * @return Indexable|WP_Error The matching indexable, or an error (missing or unknown identifier).
	 */
	public function resolve_one( array $input ) {
		if ( $this->has( $input, 'user_id' ) ) {
			return $this->by_id( (int) $input['user_id'] );
		}

		if ( $this->has( $input, 'permalink' ) ) {
			return $this->by_permalink( (string) $input['permalink'] );
		}

		return new WP_Error(
			'yoast_seo_missing_identifier',
			\__( 'Provide a user_id or a permalink to identify the author.', 'wordpress-seo' ),
			[ 'status' => 400 ],
		);
	}

	/**
	 * Resolves a user by their ID, building the indexable when it does not exist yet.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found error.
	 */
	private function by_id( int $user_id ) {
		if ( \get_userdata( $user_id ) === false ) {
			return $this->invalid_identifier( 'user_id' );
		}

		$indexable = $this->indexable_repository->find_by_id_and_type( $user_id, 'user' );

		if ( ! $indexable ) {
			return $this->unbuilt_indexable( $user_id );
		}

		return $indexable;
	}

	/**
	 * Resolves a user by the permalink of their author archive.
	 *
	 * Matches the permalink exactly against the indexable table; no WordPress URL
	 * resolution is performed, so the exact stored permalink must be provided.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found error.
	 */
	private function by_permalink( string $permalink ) {
		$indexable = $this->indexable_repository->find_by_permalink( $permalink );

		// The permalink lookup is not scoped by object type, so a post, term, or
		// archive URL can match too; only authors are valid targets here.
		if ( ! $indexable || $indexable->object_type !== 'user' ) {
			return $this->invalid_identifier( 'permalink' );
		}

		return $indexable;
	}

	/**
	 * Creates an unsaved user indexable, for a user whose indexable cannot be built.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Indexable The unsaved indexable.
	 */
	private function unbuilt_indexable( int $user_id ): Indexable {
		return $this->indexable_repository->query()->create(
			[
				'object_id'   => $user_id,
				'object_type' => 'user',
			],
		);
	}

	/**
	 * Builds the error for an identifier that does not resolve to an author.
	 *
	 * Coded yoast_seo_invalid_<field> so a caller knows which identifier to correct and retry.
	 *
	 * @param string $field The identifier that failed to resolve: 'user_id' or 'permalink'.
	 *
	 * @return WP_Error The error for the unresolvable identifier.
	 */
	private function invalid_identifier( string $field ): WP_Error {
		return new WP_Error(
			'yoast_seo_invalid_' . $field,
			\__( 'No author could be found for the given identifier.', 'wordpress-seo' ),
			[ 'status' => 404 ],
		);
	}

	/**
	 * Checks whether a non-empty identifier of the given key is present in the input.
	 *
	 * @param array<string, int|string|bool|null> $input The input.
	 * @param string                              $key   The identifier key.
	 *
	 * @return bool Whether the identifier is present and non-empty.
	 */
	private function has( array $input, string $key ): bool {
		return ( isset( $input[ $key ] ) && $input[ $key ] !== '' );
	}
}
