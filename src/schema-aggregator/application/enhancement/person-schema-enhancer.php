<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement;

use Exception;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Schema_Enhancement_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;

/**
 *  The Person schema pieces enhancer.
 */
class Person_Schema_Enhancer extends Abstract_Schema_Enhancer implements Schema_Enhancement_Interface {

	/**
	 * The config.
	 *
	 * @var Person_Config
	 */
	private $config;

	/**
	 * Sets the Person_Config instance.
	 *
	 * @param Person_Config $config The Person_Config instance.
	 * @return void
	 * @required
	 */
	public function set_person_config( Person_Config $config ) {
		$this->config = $config;
	}

	/**
	 * Enhances specific Article schema pieces.
	 *
	 * @param Schema_Piece $schema_piece The schema piece to enhance.
	 * @param Indexable    $indexable    The indexable object that is the source of the schema piece.
	 *
	 * @return Schema_Piece The enhanced schema piece.
	 */
	public function enhance( Schema_Piece $schema_piece, Indexable $indexable ): Schema_Piece {
		$schema_data = $schema_piece->get_data();
		if ( isset( $schema_data['@type'] ) && $schema_data['@type'] === 'Person' ) {
			$schema_data = $this->enhance_schema_piece( $schema_data, $indexable );
		}

		return new Schema_Piece( $schema_data, $schema_piece->get_type() );
	}

	/**
	 * Enhance a single schema piece
	 *
	 * @param array<string> $schema_data The schema data to enhance.
	 * @param Indexable     $indexable   The indexable object that is the source of the schema piece.
	 *
	 * @return array<string> The enhanced schema data.
	 */
	protected function enhance_schema_piece( array $schema_data, Indexable $indexable ): array {
		try {
			// Add jobTitle if enabled and not already present.
			if ( $this->config->is_enhancement_enabled( 'person_job_title' ) && ! isset( $schema_data['jobTitle'] ) ) {
				$job_title = $this->get_person_job_title( $indexable->author_id );
				if ( $job_title !== null && $job_title !== '' ) {
					$schema_data['jobTitle'] = $job_title;
				}
			}

			return $schema_data;
		} catch ( Exception $e ) {
			return $schema_data;
		}
	}

	/**
	 * Get person job title
	 *
	 * Retrieves job title from user meta.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return string|null Job title or null if unavailable.
	 */
	private function get_person_job_title( int $user_id ): ?string {
		$job_title = \get_user_meta( $user_id, 'job_title', true );

		if ( empty( $job_title ) ) {
			return null;
		}

		return \trim( $job_title );
	}
}
