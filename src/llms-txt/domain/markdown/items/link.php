<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items;

/**
 * Represents a link markdown item.
 */
class Link implements Item_Interface {

	/**
	 * The link text.
	 *
	 * @var string
	 */
	private $text;

	/**
	 * The anchor text.
	 *
	 * @var string
	 */
	private $anchor;

	/**
	 * Class constructor.
	 *
	 * @param string $text   The link text.
	 * @param string $anchor The anchor text.
	 */
	public function __construct( string $text, string $anchor ) {
		$this->text   = $text;
		$this->anchor = $anchor;
	}

	/**
	 * Renders the link item.
	 *
	 * @return string
	 */
	public function render(): string {
		return "[$this->text]($this->anchor)";
	}
}
