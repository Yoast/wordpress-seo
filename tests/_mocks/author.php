<?php
namespace Yoast\WP\SEO\Tests\Mocks;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Article_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;

class Author extends \Yoast\WP\SEO\Presentations\Generators\Schema\Author {

	public function __construct(
		Article_Helper $article,
		Image_Helper $image,
		Schema\Image_Helper $schema_image,
		Schema\HTML_Helper $html
	) {
		parent::__construct( $article, $image, $schema_image, $html );
	}

	/**
	 * @inheritDoc
	 */
	public function build_person_data( $user_id, Meta_Tags_Context $context ) {
		return parent::build_person_data( $user_id, $context );
	}
}
