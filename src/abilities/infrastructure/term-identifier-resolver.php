<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WP_Error;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Resolves a term identifier (ID or permalink) into a term indexable.
 *
 * Term IDs are unique across taxonomies, so the ID alone identifies a term.
 */
class Term_Identifier_Resolver {

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
	 * Resolves the input to exactly one term indexable.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing one of 'term_id' or 'permalink'.
	 *
	 * @return Indexable|WP_Error The matching indexable, or an error (missing or unknown identifier).
	 */
	public function resolve_one( array $input ) {
		if ( $this->has( $input, 'term_id' ) ) {
			return $this->by_id( (int) $input['term_id'] );
		}

		if ( $this->has( $input, 'permalink' ) ) {
			return $this->by_permalink( (string) $input['permalink'] );
		}

		return new WP_Error(
			'yoast_seo_missing_identifier',
			\__( 'Provide a term_id or a permalink to identify the term.', 'wordpress-seo' ),
			[ 'status' => 400 ],
		);
	}

	/**
	 * Resolves a term by its ID.
	 *
	 * @param int $term_id The term ID.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found error.
	 */
	private function by_id( int $term_id ) {
		$indexable = $this->indexable_repository->find_by_id_and_type( $term_id, 'term', false );

		if ( ! $indexable ) {
			return $this->invalid_identifier( 'term_id' );
		}

		return $indexable;
	}

	/**
	 * Resolves a term by its permalink.
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

		// The permalink lookup is not scoped by object type, so a post, author, or
		// archive URL can match too; only terms are valid targets here.
		if ( ! $indexable || $indexable->object_type !== 'term' ) {
			return $this->invalid_identifier( 'permalink' );
		}

		return $indexable;
	}

	/**
	 * Builds the error for an identifier that does not resolve to a term.
	 *
	 * Coded yoast_seo_invalid_<field> so a caller knows which identifier to correct and retry.
	 *
	 * @param string $field The identifier that failed to resolve: 'term_id' or 'permalink'.
	 *
	 * @return WP_Error The error for the unresolvable identifier.
	 */
	private function invalid_identifier( string $field ): WP_Error {
		return new WP_Error(
			'yoast_seo_invalid_' . $field,
			\__( 'No term could be found for the given identifier.', 'wordpress-seo' ),
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
