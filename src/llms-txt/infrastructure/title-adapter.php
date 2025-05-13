<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title;

/**
 * The adapter of the title.
 */
class Title_Adapter {

	/**
	 * Gets the title.
	 *
	 * @return string The title.
	 */
	public function get_title(): Title {
		return new Title( \get_bloginfo( 'name' ), \get_bloginfo( 'description' ) );
	}
}
