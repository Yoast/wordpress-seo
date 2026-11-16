<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Meta_Writer;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Builders\Indexable_Builder;

/**
 * Application service that updates the SEO data of a single author archive.
 *
 * The input is applied onto the resolved indexable (the desired state), cascaded
 * to the user meta (the source of truth), and the indexable is then rebuilt from
 * that meta so reads and the rest of the plugin stay consistent.
 */
class Author_SEO_Data_Updater {

	/**
	 * The author identifier resolver.
	 *
	 * @var Author_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The author SEO field map.
	 *
	 * @var Author_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable access checker.
	 *
	 * @var Indexable_Access_Checker
	 */
	private $access_checker;

	/**
	 * The author SEO meta writer.
	 *
	 * @var Author_SEO_Meta_Writer
	 */
	private $meta_writer;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * Constructor.
	 *
	 * @param Author_Identifier_Resolver $resolver          The author identifier resolver.
	 * @param Author_SEO_Field_Map       $field_map         The author SEO field map.
	 * @param Indexable_Access_Checker   $access_checker    The indexable access checker.
	 * @param Author_SEO_Meta_Writer     $meta_writer       The author SEO meta writer.
	 * @param Indexable_Builder          $indexable_builder The indexable builder.
	 */
	public function __construct(
		Author_Identifier_Resolver $resolver,
		Author_SEO_Field_Map $field_map,
		Indexable_Access_Checker $access_checker,
		Author_SEO_Meta_Writer $meta_writer,
		Indexable_Builder $indexable_builder
	) {
		$this->resolver          = $resolver;
		$this->field_map         = $field_map;
		$this->access_checker    = $access_checker;
		$this->meta_writer       = $meta_writer;
		$this->indexable_builder = $indexable_builder;
	}

	/**
	 * Updates the SEO data of the author matching the input and returns its new state.
	 *
	 * Only fields present in the input are changed (patch semantics); a present but
	 * empty value clears the field.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the author plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	public function update_author_seo_data( array $input ) {
		$indexable = $this->resolver->resolve_one( $input );

		if ( $indexable instanceof WP_Error ) {
			return $indexable;
		}

		// The capability gate on the ability is site-wide; the write itself is
		// only allowed on users the user could also edit through the user profile.
		$can_edit = $this->access_checker->ensure_can_edit( $indexable );

		if ( $can_edit instanceof WP_Error ) {
			return $can_edit;
		}

		$changed_columns = $this->field_map->apply_to_indexable( $input, $indexable );

		if ( ! $this->meta_writer->write_columns( $indexable, $changed_columns ) ) {
			return $this->unavailable_error( \__( 'The author SEO data could not be saved.', 'wordpress-seo' ) );
		}

		// A user meta write does not trigger the indexable watcher, so rebuild the read model
		// explicitly from the meta we just wrote.
		$rebuilt = $this->indexable_builder->build_for_id_and_type( (int) $indexable->object_id, 'user', $indexable );

		if ( ! $rebuilt ) {
			return $this->unavailable_error( \__( 'The author SEO data was saved but the indexable could not be rebuilt.', 'wordpress-seo' ) );
		}

		return $this->field_map->to_seo_array( $rebuilt );
	}

	/**
	 * Builds the error for author SEO data that could not be persisted or reloaded.
	 *
	 * @param string $message The error message.
	 *
	 * @return WP_Error The error.
	 */
	private function unavailable_error( string $message ): WP_Error {
		return new WP_Error( 'yoast_seo_author_data_unavailable', $message, [ 'status' => 500 ] );
	}
}
