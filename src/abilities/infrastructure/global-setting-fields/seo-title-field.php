<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields;

use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Not_Found_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Search_Page_Target;

/**
 * The SEO title template, which every target has.
 */
class SEO_Title_Field extends Abstract_Global_Setting_Field {

	/**
	 * Returns the name of the field.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'seo_title';
	}

	/**
	 * Returns the JSON schema of the SEO title template.
	 *
	 * @return array<string, string> The JSON schema.
	 */
	public function get_schema(): array {
		return [
			'type'        => 'string',
			'description' => \__( 'The SEO title template, shown in search results and in the browser tab. It can contain replacement variables. An empty string clears it.', 'wordpress-seo' ),
		];
	}

	/**
	 * Returns the option pattern of each target that has an SEO title template.
	 *
	 * @return array<string, string> The option pattern of each target, keyed by target name.
	 */
	protected function get_option_patterns(): array {
		return [
			Homepage_Target::NAME          => 'title-home-wpseo',
			Author_Archives_Target::NAME   => 'title-author-wpseo',
			Date_Archives_Target::NAME     => 'title-archive-wpseo',
			Search_Page_Target::NAME       => 'title-search-wpseo',
			Not_Found_Page_Target::NAME    => 'title-404-wpseo',
			Post_Type_Archive_Target::NAME => 'title-ptarchive-%s',
		];
	}
}
