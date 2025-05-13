<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections;

/**
 * Represents the description section.
 */
class Description implements Section_Interface {

	/**
	 * The description.
	 *
	 * @var string
	 */
	private $description;

	/**
	 * Class constructor.
	 *
	 * @param string $description The description.
	 */
	public function __construct( string $description ) {
		$this->description = $description;
	}

	/**
	 * Returns the prefix of the description section.
	 *
	 * @return string
	 */
	public function get_prefix(): string {
		return '> ';
	}

	/**
	 * Renders the description section.
	 *
	 * @return string
	 */
	public function render(): string {
		return $this->description;
	}
}
