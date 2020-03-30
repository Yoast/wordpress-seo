<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates the HTML for an inline Help Button and Panel.
 */
class WPSEO_Admin_Help_Panel {

	/**
	 * Unique identifier of the element the inline help refers to, used as an identifier in the html.
	 *
	 * @var string
	 */
	private $id;

	/**
	 * The Help Button text. Needs a properly escaped string.
	 *
	 * @var string
	 */
	private $help_button_text;

	/**
	 * The Help Panel content. Needs a properly escaped string (might contain HTML).
	 *
	 * @var string
	 */
	private $help_content;

	/**
	 * Optional Whether to print out a container div element for the Help Panel, used for styling.
	 *
	 * @var string
	 */
	private $wrapper;

	/**
	 * Constructor.
	 *
	 * @param string $id               Unique identifier of the element the inline help refers to, used as
	 *                                 an identifier in the html.
	 * @param string $help_button_text The Help Button text. Needs a properly escaped string.
	 * @param string $help_content     The Help Panel content. Needs a properly escaped string (might contain HTML).
	 * @param string $wrapper          Optional Whether to print out a container div element for the Help Panel,
	 *                                 used for styling.
	 *                                 Pass a `has-wrapper` value to print out the container. Default: no container.
	 */
	public function __construct( $id, $help_button_text, $help_content, $wrapper = '' ) {
		$this->id               = $id;
		$this->help_button_text = $help_button_text;
		$this->help_content     = $help_content;
		$this->wrapper          = $wrapper;
	}

	/**
	 * Returns the html for the Help Button.
	 *
	 * @return string
	 */
	public function get_button_html() {

		if ( ! $this->id || ! $this->help_button_text || ! $this->help_content ) {
			return '';
		}

		return sprintf(
			'<a class="yoast-help" target="_blank" href="%1$s">
				<span class="yoast-help__icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" role="img" aria-hidden="true"
						 focusable="false"><path
							d="M12 6A6 6 0 110 6a6 6 0 0112 0zM6.2 2C4.8 2 4 2.5 3.3 3.5l.1.4.8.7.4-.1c.5-.5.8-.9 1.4-.9.5 0 1.1.4 1.1.8s-.3.6-.7.9C5.8 5.6 5 6 5 7c0 .2.2.4.3.4h1.4L7 7c0-.8 2-.8 2-2.6C9 3 7.5 2 6.2 2zM6 8a1.1 1.1 0 100 2.2A1.1 1.1 0 006 8z"/></svg>
				</span>
				<span class="screen-reader-text">%2$s</span>
				<span class="screen-reader-text">(Opens in a new browser tab)</span>
			</a>',
			$this->help_button_text
		);
	}

	/**
	 * Returns the html for the Help Panel.
	 *
	 * @return string
	 */
	public function get_panel_html() {

		if ( ! $this->id || ! $this->help_button_text || ! $this->help_content ) {
			return '';
		}

		$wrapper_start = '';
		$wrapper_end   = '';

		if ( $this->wrapper === 'has-wrapper' ) {
			$wrapper_start = '<div class="yoast-seo-help-container">';
			$wrapper_end   = '</div>';
		}

		return sprintf(
			'%1$s<p id="%2$s-help" class="yoast-help-panel">%3$s</p>%4$s',
			$wrapper_start,
			esc_attr( $this->id ),
			$this->help_content,
			$wrapper_end
		);
	}
}
