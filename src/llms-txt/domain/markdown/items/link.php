<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items;

use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;

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

	/**
	 * Escapes the markdown content.
	 *
	 * @param param Markdown_Escaper $markdown_escaper The markdown escaper.
	 *
	 * @return void
	 */
	public function escape_markdown( Markdown_Escaper $markdown_escaper ): void {
		$this->text   = $markdown_escaper->escape_markdown_content( $this->text );
		$this->anchor = $markdown_escaper->escape_markdown_url( $this->anchor );
	}
}
