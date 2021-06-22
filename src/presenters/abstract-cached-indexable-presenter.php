<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Decorator presenter class for indexable presentations, preventing multiple gets on the same object
 */
class Abstract_Cached_Indexable_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * The decorated class.
	 *
	 * @var Abstract_Indexable_Presenter
	 */
	protected $decorated;

	/**
	 * The read-once-use-many value produced by the decorated class.
	 *
	 * @var string|object|array
	 */
	private $cached_value;

	/**
	 * Abstract_Cached_Indexable_Presenter constructor.
	 *
	 * @param Abstract_Indexable_Presenter $decorated The class to be decorated.
	 */
	public function __construct( Abstract_Indexable_Presenter $decorated ) {
		$this->decorated = $decorated;
	}

	/**
	 * Gets the cached value of a presentation if any, or a raw value of a presentation as fallback.
	 *
	 * @return string|array The raw value.
	 */
	public function get() {
		if ( ! isset( $this->cached_value ) ) {
			$this->cached_value = $this->decorated->get();
		}
		return $this->cached_value;
	}

	/**
	 * Returns the output as string.
	 *
	 * @return string The output.
	 */
	public function present() {
		// Pass helpers on to decorated class.
		$this->decorated->presentation = $this->presentation;
		$this->decorated->replace_vars = $this->replace_vars;
		$this->decorated->helpers      = $this->helpers;

		$this->decorated->present();
	}
}
