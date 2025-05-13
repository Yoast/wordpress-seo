<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description;


/**
 * The builder of the description section.
 */
class Description_Builder {

	/**
	 * Builds the description section.
	 *
	 * @return Description The description section.
	 */
	public function build_description(): Description {
		return new Description( 'description' );
	}
}
