<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

/**
 * Shares the expectations of the post SEO data abilities between their tests.
 */
trait Post_SEO_Data_Schema_Trait {

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
	 * Returns the expected post SEO data output schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_output_schema(): array {
		$nullable_string = [ 'type' => [ 'string', 'null' ] ];
		$score           = static function ( $analysis ) {
			return [
				'type'        => 'string',
				'enum'        => [ 'na', 'bad', 'ok', 'good' ],
				'description' => \sprintf(
					'The result of the %s that ran on the post when it was last saved.',
					$analysis,
				),
			];
		};
		$rendered        = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					'The %s as output on the front end: the global default template applied when no custom value is set, with replacement variables expanded. Null when nothing is output.',
					$field,
				),
			];
		};
		$raw             = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => \sprintf(
					'The custom %s as stored for the post, which may contain unexpanded replacement variables. Null when no custom value is set; the rendered companion field carries what is actually output.',
					$field,
				),
			];
		};

		return [
			'type'       => 'object',
			'properties' => [
				'post_id'                         => [ 'type' => 'integer' ],
				'post_title'                      => $nullable_string,
				'permalink'                       => $nullable_string,
				'post_type'                       => [ 'type' => 'string' ],
				'post_status'                     => $nullable_string,
				'seo_title'                       => $raw( 'SEO title' ),
				'seo_title_rendered'              => $rendered( 'SEO title' ),
				'meta_description'                => $raw( 'meta description' ),
				'meta_description_rendered'       => $rendered( 'meta description' ),
				'focus_keyphrase'                 => $nullable_string,
				'canonical'                       => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The custom canonical URL as stored for the post. Null when no custom value is set; the rendered companion field carries what is actually output.',
				],
				'canonical_rendered'              => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The canonical URL as output on the front end: the custom value when set, otherwise the permalink of the post. Null when nothing is output.',
				],
				'is_cornerstone'                  => [ 'type' => 'boolean' ],
				'noindex'                         => [
					'type'        => [ 'boolean', 'null' ],
					'description' => 'Whether search engines are told not to index this post. true means noindex (the post is excluded from search results); false means the post is forced to be indexed; null means no setting is stored and the post-type default applies.',
				],
				'nofollow'                        => [ 'type' => 'boolean' ],
				'noimageindex'                    => [ 'type' => 'boolean' ],
				'noarchive'                       => [ 'type' => 'boolean' ],
				'nosnippet'                       => [ 'type' => 'boolean' ],
				'open_graph_title'                => $raw( 'Open Graph title' ),
				'open_graph_title_rendered'       => $rendered( 'Open Graph title' ),
				'open_graph_description'          => $raw( 'Open Graph description' ),
				'open_graph_description_rendered' => $rendered( 'Open Graph description' ),
				'twitter_title'                   => $raw( 'X title' ),
				'twitter_title_rendered'          => $rendered( 'X title' ),
				'twitter_description'             => $raw( 'X description' ),
				'twitter_description_rendered'    => $rendered( 'X description' ),
				'schema_page_type'                => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The Schema.org page type stored for the post. Null means no override is set and the default for the post type applies.',
				],
				'schema_article_type'             => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The Schema.org article type stored for the post. Null means no override is set and the default for the post type applies.',
				],
				'seo_score'                       => $score( 'SEO analysis' ),
				'readability_score'               => $score( 'readability analysis' ),
				'inclusive_language_score'        => $score( 'inclusive language analysis' ),
			],
		];
	}
}
