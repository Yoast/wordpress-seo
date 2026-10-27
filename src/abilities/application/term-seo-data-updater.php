<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Application service that updates the SEO data of a single term, stored in the term meta.
 */
class Term_SEO_Data_Updater extends Abstract_SEO_Data_Updater {

	// phpcs:disable Generic.CodeAnalysis.UselessOverridingMethod.Found -- Narrows the parameter types, so the container injects the term collaborators.

	/**
	 * Constructor.
	 *
	 * @param Term_Identifier_Resolver $resolver          The term identifier resolver.
	 * @param Term_SEO_Field_Map       $field_map         The term SEO field map.
	 * @param Indexable_Access_Checker $access_checker    The indexable access checker.
	 * @param Term_SEO_Meta_Writer     $meta_writer       The term SEO meta writer.
	 * @param Indexable_Builder        $indexable_builder The indexable builder.
	 */
	public function __construct(
		Term_Identifier_Resolver $resolver,
		Term_SEO_Field_Map $field_map,
		Indexable_Access_Checker $access_checker,
		Term_SEO_Meta_Writer $meta_writer,
		Indexable_Builder $indexable_builder
	) {
		parent::__construct( $resolver, $field_map, $access_checker, $meta_writer, $indexable_builder );
	}

	// phpcs:enable Generic.CodeAnalysis.UselessOverridingMethod.Found

	/**
	 * Updates the SEO data of the term matching the input and returns its new state.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the term plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	public function update_term_seo_data( array $input ) {
		return $this->update( $input );
	}

	/**
	 * Returns the indexable object type of terms.
	 *
	 * @return string The object type.
	 */
	protected function get_object_type(): string {
		return 'term';
	}

	/**
	 * Builds the error for term SEO data that could not be saved.
	 *
	 * @return WP_Error The error.
	 */
	protected function save_failed_error(): WP_Error {
		return $this->unavailable_error( \__( 'The term SEO data could not be saved.', 'wordpress-seo' ) );
	}

	// phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- Required by the parent class; terms return an error instead of the saved values.

	/**
	 * Builds the error for term SEO data that was saved, but whose indexable could not be rebuilt.
	 *
	 * @param Indexable $indexable The indexable holding the saved values.
	 *
	 * @return WP_Error The error.
	 */
	protected function rebuild_failed_result( Indexable $indexable ): WP_Error {
		return $this->unavailable_error( \__( 'The term SEO data was saved but the indexable could not be rebuilt.', 'wordpress-seo' ) );
	}

	// phpcs:enable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable

	/**
	 * Builds the error for term SEO data that could not be persisted or reloaded.
	 *
	 * @param string $message The error message.
	 *
	 * @return WP_Error The error.
	 */
	private function unavailable_error( string $message ): WP_Error {
		return new WP_Error( 'yoast_seo_term_data_unavailable', $message, [ 'status' => 500 ] );
	}
}
