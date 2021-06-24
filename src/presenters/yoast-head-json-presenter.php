<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Presenter class for the robots output.
 */
class Yoast_Head_JSON_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'yoast_head';

	/**
	 * The key / value pairs that should be converted to JSON
	 *
	 * @var array
	 */
	public $json_dictionary;

	protected $tag_format = self::META_PROPERTY_CONTENT;

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function get() {
		$json_head = $this->json_dictionary;

		return json_encode( $json_head, JSON_FORCE_OBJECT | JSON_NUMERIC_CHECK );
	}
}
