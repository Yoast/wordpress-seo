<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Decorator presenter class for indexable presentations, preventing multiple gets on the same object
 */
abstract class Abstract_Cached_Indexable_Tag_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The read-once-use-many value produced by the decorated class.
	 *
	 * @var mixed
	 */
	private $cached_value;

	/**
	 * Gets the cached value of a presentation if available, or a fresh value of a presentation as fallback.
	 *
	 * @return string|array The raw value.
	 */
	public function get() {
		if ( ! isset( $this->cached_value ) ) {
			$this->cached_value = $this->refresh();
		}
		return $this->cached_value;
	}

	/**
	 * Gets a fresh value to be used in the representation.
	 *
	 * @return mixed
	 */
	abstract function refresh();
}
