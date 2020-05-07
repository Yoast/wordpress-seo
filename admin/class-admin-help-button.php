<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates the HTML for an inline Help Button and Panel.
 */
class WPSEO_Admin_Help_Button {

	/**
	 * @var string
	 */
	protected $screen_reader_text;

	/**
	 * @var string
	 */
	protected $url;

	/**
	 * WPSEO_Admin_Help_Button constructor.
	 *
	 * @param string $url                The URL to get help on.
	 * @param string $screen_reader_text The screen reader text that explains what we're providing help with.
	 */
	public function __construct( $url, $screen_reader_text ) {
		$this->url                = $url;
		$this->screen_reader_text = $screen_reader_text;
	}

	/**
	 * Returns the html for the Help Button.
	 *
	 * @return string The button's HTML.
	 */
	public function __toString() {

		return sprintf(
			'<a class="yoast-help" target="_blank" href="%1$s">
                <span class="yoast-help__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" role="img" aria-hidden="true" focusable="false"><path d="M12 6A6 6 0 110 6a6 6 0 0112 0zM6.2 2C4.8 2 4 2.5 3.3 3.5l.1.4.8.7.4-.1c.5-.5.8-.9 1.4-.9.5 0 1.1.4 1.1.8s-.3.6-.7.9C5.8 5.6 5 6 5 7c0 .2.2.4.3.4h1.4L7 7c0-.8 2-.8 2-2.6C9 3 7.5 2 6.2 2zM6 8a1.1 1.1 0 100 2.2A1.1 1.1 0 006 8z"/></svg>
				</span>
				<span class="screen-reader-text">%2$s</span>
			</a>',
			WPSEO_Shortlinker::get( $this->url ),
			$this->screen_reader_text
		);
	}

}
