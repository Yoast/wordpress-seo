<?php

namespace Yoast\WP\SEO\Editors\Domain\Seo;

class Keywords implements Seo_Plugin_Data_Interface {

	/**
	 * @var array $keyword_usage_count The keyword and the associated posts that use it.
	 */
	private $keyword_usage_count;

	/**
	 * @var array $keyword_usage_per_type The post types for the given post IDs.
	 */
	private $keyword_usage_per_type;

	/**
	 * @param array $keyword_usage_count    The keyword and the associated posts that use it.
	 * @param array $keyword_usage_per_type The post types for the given post IDs.
	 */
	public function __construct( array $keyword_usage_count, array $keyword_usage_per_type ) {
		$this->keyword_usage_count    = $keyword_usage_count;
		$this->keyword_usage_per_type = $keyword_usage_per_type;
	}

	public function to_array(): array {
		return [
			'keyword_usage'          => $this->keyword_usage_count,
			'keyword_usage_per_type' => $this->keyword_usage_per_type,
		];
	}

	public function to_legacy_array(): array {
		return [
			'keyword_usage'            => $this->keyword_usage_count,
			'keyword_usage_post_types' => $this->keyword_usage_per_type,
		];
	}


}
