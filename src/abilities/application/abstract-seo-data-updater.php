<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Abstract_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Updates the SEO data of a single object whose indexable is built from its meta.
 *
 * The input is applied onto the resolved indexable (the desired state), cascaded
 * to the meta (the source of truth), and the indexable is then rebuilt from
 * that meta so reads and the rest of the plugin stay consistent.
 */
abstract class Abstract_SEO_Data_Updater {

	/**
	 * The identifier resolver.
	 *
	 * @var SEO_Data_Identifier_Resolver_Interface
	 */
	private $resolver;

	/**
	 * The SEO field map.
	 *
	 * @var Abstract_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable access checker.
	 *
	 * @var Indexable_Access_Checker
	 */
	private $access_checker;

	/**
	 * The SEO meta writer.
	 *
	 * @var SEO_Data_Meta_Writer_Interface
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
	 * @param SEO_Data_Identifier_Resolver_Interface $resolver          The identifier resolver.
	 * @param Abstract_SEO_Field_Map                 $field_map         The SEO field map.
	 * @param Indexable_Access_Checker               $access_checker    The indexable access checker.
	 * @param SEO_Data_Meta_Writer_Interface         $meta_writer       The SEO meta writer.
	 * @param Indexable_Builder                      $indexable_builder The indexable builder.
	 */
	public function __construct(
		SEO_Data_Identifier_Resolver_Interface $resolver,
		Abstract_SEO_Field_Map $field_map,
		Indexable_Access_Checker $access_checker,
		SEO_Data_Meta_Writer_Interface $meta_writer,
		Indexable_Builder $indexable_builder
	) {
		$this->resolver          = $resolver;
		$this->field_map         = $field_map;
		$this->access_checker    = $access_checker;
		$this->meta_writer       = $meta_writer;
		$this->indexable_builder = $indexable_builder;
	}

	/**
	 * Returns the indexable object type of the objects this updater updates.
	 *
	 * @return string The object type, e.g. 'term'.
	 */
	abstract protected function get_object_type(): string;

	/**
	 * Builds the error for SEO data that could not be saved.
	 *
	 * @return WP_Error The error.
	 */
	abstract protected function save_failed_error(): WP_Error;

	/**
	 * Builds the result for SEO data that was saved, but whose indexable could not be rebuilt.
	 *
	 * @param Indexable $indexable The indexable holding the saved values.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The saved SEO data, or an error.
	 */
	abstract protected function rebuild_failed_result( Indexable $indexable );

	/**
	 * Updates the SEO data of the object matching the input and returns its new state.
	 *
	 * Only fields present in the input are changed (patch semantics); a present but
	 * empty value clears the field.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the object plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	protected function update( array $input ) {
		$indexable = $this->resolver->resolve_one( $input );

		if ( $indexable instanceof WP_Error ) {
			return $indexable;
		}

		// The capability gate on the ability is site-wide; the write itself is
		// only allowed on objects the user could also edit through the admin.
		$can_edit = $this->access_checker->ensure_can_edit( $indexable );

		if ( $can_edit instanceof WP_Error ) {
			return $can_edit;
		}

		$changed_columns = $this->field_map->apply_to_indexable( $input, $indexable );

		if ( ! $this->meta_writer->write_columns( $indexable, $changed_columns ) ) {
			return $this->save_failed_error();
		}

		// A meta write does not trigger the indexable watcher, so rebuild the read model
		// explicitly from the meta we just wrote.
		$rebuilt = $this->indexable_builder->build_for_id_and_type( (int) $indexable->object_id, $this->get_object_type(), $indexable );

		if ( ! $rebuilt ) {
			return $this->rebuild_failed_result( $indexable );
		}

		return $this->field_map->to_seo_array( $rebuilt );
	}
}
