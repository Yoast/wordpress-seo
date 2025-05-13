<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections;

/**
 * Represents the intro section.
 */
class Intro implements Section_Interface {

	/**
	 * The intro content.
	 *
	 * @var string
	 */
	private $intro_content;

	/**
	 * Class constructor.
	 *
	 * @param string $intro_content The intro content.
	 */
	public function __construct( string $intro_content ) {
		$this->intro_content = $intro_content;
	}

	/**
	 * Returns the prefix of the intro section.
	 *
	 * @return string
	 */
	public function get_prefix(): string {
		return '';
	}

	/**
	 * Returns the content of the intro section.
	 *
	 * @return string
	 */
	public function render(): string {
		return $this->intro_content;
	}
}
