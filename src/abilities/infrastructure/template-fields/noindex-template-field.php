<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Author_Archives_Template_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Date_Archives_Template_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Post_Type_Archive_Template_Target;

/**
 * Whether search engines are told not to index the pages, which only the archives can change.
 */
class Noindex_Template_Field extends Abstract_Template_Field {

	/**
	 * Returns the name of the field.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'noindex';
	}

	/**
	 * Returns the JSON schema of the noindex setting.
	 *
	 * @return array<string, string> The JSON schema.
	 */
	public function get_schema(): array {
		return [
			'type'        => 'boolean',
			'description' => \__( 'Whether search engines are told not to index these pages. true hides them from search results and excludes them from the XML sitemaps; false lets them be shown in search results.', 'wordpress-seo' ),
		];
	}

	/**
	 * Returns the option pattern of each target that has a noindex setting.
	 *
	 * @return array<string, string> The option pattern of each target, keyed by target name.
	 */
	protected function get_option_patterns(): array {
		return [
			Author_Archives_Template_Target::NAME   => 'noindex-author-wpseo',
			Date_Archives_Template_Target::NAME     => 'noindex-archive-wpseo',
			Post_Type_Archive_Template_Target::NAME => 'noindex-ptarchive-%s',
		];
	}
}
