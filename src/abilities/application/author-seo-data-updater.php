<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Meta_Writer;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Application service that updates the SEO data of a single author archive, stored in the user meta.
 */
class Author_SEO_Data_Updater extends Abstract_SEO_Data_Updater {

	/**
	 * The author SEO field map.
	 *
	 * @var Author_SEO_Field_Map
	 */
	private $author_field_map;

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
		parent::__construct( $resolver, $field_map, $access_checker, $meta_writer, $indexable_builder );

		$this->author_field_map = $field_map;
	}

	/**
	 * Updates the SEO data of the author matching the input and returns its new state.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the author plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	public function update_author_seo_data( array $input ) {
		return $this->update( $input );
	}

	/**
	 * Returns the indexable object type of authors.
	 *
	 * @return string The object type.
	 */
	protected function get_object_type(): string {
		return 'user';
	}

	/**
	 * Builds the error for author SEO data that could not be saved.
	 *
	 * @return WP_Error The error.
	 */
	protected function save_failed_error(): WP_Error {
		return new WP_Error(
			'yoast_seo_author_data_unavailable',
			\__( 'The author SEO data could not be saved.', 'wordpress-seo' ),
			[ 'status' => 500 ],
		);
	}

	/**
	 * Returns the saved author SEO data with a warning, as the author indexable is not built when the author archive
	 * is not output, like when author archives are disabled. The user profile saves the settings anyway.
	 *
	 * @param Indexable $indexable The indexable holding the saved values.
	 *
	 * @return array<string, int|string|bool|null> The saved SEO data.
	 */
	protected function rebuild_failed_result( Indexable $indexable ): array {
		return $this->author_field_map->to_unbuilt_seo_array( $indexable );
	}
}
