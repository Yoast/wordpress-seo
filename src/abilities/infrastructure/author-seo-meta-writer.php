<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Cascades indexable columns to the user meta, the source of truth for authors.
 *
 * The values are stored like the Yoast SEO fields of the user profile store them.
 */
class Author_SEO_Meta_Writer {

	/**
	 * Maps the writable indexable columns to their user meta key.
	 *
	 * @var array<string, string>
	 */
	private const COLUMN_META_KEYS = [
		'title'             => 'wpseo_title',
		'description'       => 'wpseo_metadesc',
		'is_robots_noindex' => 'wpseo_noindex_author',
	];

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The sanitization helper.
	 *
	 * @var Sanitization_Helper
	 */
	private $sanitization_helper;

	/**
	 * Constructor.
	 *
	 * @param User_Helper         $user_helper         The user helper.
	 * @param Sanitization_Helper $sanitization_helper The sanitization helper.
	 */
	public function __construct( User_Helper $user_helper, Sanitization_Helper $sanitization_helper ) {
		$this->user_helper         = $user_helper;
		$this->sanitization_helper = $sanitization_helper;
	}

	/**
	 * Writes the given columns of a user indexable to the user meta.
	 *
	 * @param Indexable     $indexable The user indexable holding the desired state.
	 * @param array<string> $columns   The indexable columns to write.
	 *
	 * @return bool Whether the user meta could be written.
	 */
	public function write_columns( Indexable $indexable, array $columns ): bool {
		$user_id = (int) $indexable->object_id;

		if ( \get_userdata( $user_id ) === false ) {
			return false;
		}

		$columns = \array_intersect( $columns, \array_keys( self::COLUMN_META_KEYS ) );

		foreach ( $columns as $column ) {
			$this->write_column( $user_id, $column, $indexable->{$column} );
		}

		if ( $columns !== [] ) {
			// Like saving the user profile page does, so the author sitemap gets the right last modified date.
			$this->user_helper->update_meta( $user_id, '_yoast_wpseo_profile_updated', \time() );
		}

		return true;
	}

	/**
	 * Writes a single indexable column to the user meta.
	 *
	 * @param int              $user_id The user ID.
	 * @param string           $column  The indexable column.
	 * @param string|bool|null $value   The column value.
	 *
	 * @return void
	 */
	private function write_column( int $user_id, string $column, $value ): void {
		$meta_key = self::COLUMN_META_KEYS[ $column ];

		if ( $column === 'is_robots_noindex' ) {
			// The profile deletes the meta when the checkbox is unticked, as it does not allow an empty value.
			if ( $value ) {
				$this->user_helper->update_meta( $user_id, $meta_key, 'on' );
				return;
			}

			$this->user_helper->delete_meta( $user_id, $meta_key );
			return;
		}

		$this->user_helper->update_meta( $user_id, $meta_key, $this->sanitization_helper->sanitize_text_field( (string) $value ) );
	}
}
