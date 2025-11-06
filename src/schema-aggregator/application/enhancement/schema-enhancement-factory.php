<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Schema_Enhancement_Interface;

/**
 * The Schema_Enhancement_Factory.
 */
class Schema_Enhancement_Factory {

	/**
	 * The schema enhancer.
	 *
	 * @var Article_Schema_Enhancer
	 */
	private $article_schema_enhancer;

	/**
	 * The person schema enhancer.
	 *
	 * @var Person_Schema_Enhancer
	 */
	private $person_schema_enhancer;

	/**
	 * Constructor.
	 *
	 * @param Article_Schema_Enhancer $article_schema_enhancer The article schema enhancer.
	 * @param Person_Schema_Enhancer  $person_schema_enhancer  The person schema enhancer.
	 */
	public function __construct(
		Article_Schema_Enhancer $article_schema_enhancer,
		Person_Schema_Enhancer $person_schema_enhancer
	) {
		$this->article_schema_enhancer = $article_schema_enhancer;
		$this->person_schema_enhancer  = $person_schema_enhancer;
	}

	/**
	 * Returns the appropriate schema enhancer based on the schema type.
	 *
	 * @param array<string> $schema_types The types of schema (e.g., 'Article', 'Person').
	 *
	 * @return Schema_Enhancement_Interface|null The corresponding schema enhancer or null if none exists.
	 */
	public function get_enhancer( array $schema_types ): ?Schema_Enhancement_Interface {
		foreach ( $schema_types as $schema_type_value ) {
			switch ( $schema_type_value ) {
				case 'Article':
					return $this->article_schema_enhancer;
				case 'Person':
					return $this->person_schema_enhancer;
				default:
					return null; // No enhancer available for the given schema type.
			}
		}
	}
}
