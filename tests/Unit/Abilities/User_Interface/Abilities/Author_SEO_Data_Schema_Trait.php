<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

/**
 * Shares the expectations of the author SEO data abilities between their tests.
 */
trait Author_SEO_Data_Schema_Trait {

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Returns the expected author SEO data output schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_author_output_schema(): array {
		$rendered = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					'The %s as output on the front end: the global default template applied when no custom value is set, with replacement variables expanded. Null when nothing is output.',
					$field,
				),
			];
		};
		$raw      = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					'The custom %s as stored, which may contain unexpanded replacement variables. Null when no custom value is set; the rendered companion field carries what is actually output.',
					$field,
				),
			];
		};

		return [
			'type'       => 'object',
			'properties' => [
				'user_id'                   => [ 'type' => 'integer' ],
				'user_name'                 => [ 'type' => [ 'string', 'null' ] ],
				'permalink'                 => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The permalink (URL) of the author archive. Null when the author archive is excluded, for example because author archives are disabled.',
				],
				'seo_title'                 => $raw( 'SEO title' ),
				'seo_title_rendered'        => $rendered( 'SEO title' ),
				'meta_description'          => $raw( 'meta description' ),
				'meta_description_rendered' => $rendered( 'meta description' ),
				'noindex'                   => [
					'type'        => 'boolean',
					'description' => 'Whether search engines are told not to index this author archive. true means noindex (the archive is excluded from search results). When the site settings set all author archives to noindex, that setting applies regardless of this one.',
				],
				'warning'                   => [
					'type'        => 'string',
					'description' => 'Only present when the author archive is excluded, for example because author archives are disabled: the settings are saved, but have no effect while it is. Meant to be relayed to the user.',
				],
			],
		];
	}
}
