<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Author_Archives_Template_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Date_Archives_Template_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Homepage_Template_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Post_Type_Archive_Template_Target;

/**
 * The meta description template, which the search results and 404 pages do not have.
 */
class Meta_Description_Template_Field extends Abstract_Template_Field {

	/**
	 * Returns the name of the field.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'meta_description';
	}

	/**
	 * Returns the JSON schema of the meta description template.
	 *
	 * @return array<string, string> The JSON schema.
	 */
	public function get_schema(): array {
		return [
			'type'        => 'string',
			'description' => \__( 'The meta description template, shown below the title in search results. It can contain replacement variables. An empty string clears it.', 'wordpress-seo' ),
		];
	}

	/**
	 * Returns the option pattern of each target that has a meta description template.
	 *
	 * @return array<string, string> The option pattern of each target, keyed by target name.
	 */
	protected function get_option_patterns(): array {
		return [
			Homepage_Template_Target::NAME          => 'metadesc-home-wpseo',
			Author_Archives_Template_Target::NAME   => 'metadesc-author-wpseo',
			Date_Archives_Template_Target::NAME     => 'metadesc-archive-wpseo',
			Post_Type_Archive_Template_Target::NAME => 'metadesc-ptarchive-%s',
		];
	}
}
