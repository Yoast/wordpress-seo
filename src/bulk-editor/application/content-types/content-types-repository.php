<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Bulk_Editor\Application\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Types_Collector;

/**
 * The repository to get content types for the bulk editor.
 */
class Content_Types_Repository {

	/**
	 * The content types collector.
	 *
	 * @var Content_Types_Collector
	 */
	protected $content_types_collector;

	/**
	 * The constructor.
	 *
	 * @param Content_Types_Collector $content_types_collector The content types collector.
	 */
	public function __construct( Content_Types_Collector $content_types_collector ) {
		$this->content_types_collector = $content_types_collector;
	}

	/**
	 * Returns the content types array.
	 *
	 * @return array<array<string, string>> The content types array.
	 */
	public function get_content_types(): array {
		return $this->content_types_collector->get_content_types()->to_array();
	}
}
