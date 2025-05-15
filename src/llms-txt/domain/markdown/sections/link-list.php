<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;

/**
 * Represents a link list markdown section.
 */
class Link_List implements Section_Interface {

	/**
	 * The type of the links.
	 *
	 * @var string
	 */
	private $type;

	/**
	 * The links.
	 *
	 * @var Link[]
	 */
	private $links;

	/**
	 * Class constructor.
	 *
	 * @param string $type  The type of the links.
	 * @param Link[] $links The links.
	 */
	public function __construct( string $type, array $links ) {
		$this->type  = $type;
		$this->links = $links;
	}

	/**
	 * Adds a link to the list.
	 *
	 * @param Link $link The link to add.
	 *
	 * @return void
	 */
	public function add_link( Link $link ): void {
		$this->links[] = $link;
	}

	/**
	 * Returns the prefix of the link list section.
	 *
	 * @return string
	 */
	public function get_prefix(): string {
		return '## ';
	}

	/**
	 * Renders the link item.
	 *
	 * @return string
	 */
	public function render(): string {
		if ( empty( $this->links ) ) {
			return '';
		}

		$rendered_links = [];
		foreach ( $this->links as $link ) {
			$rendered_links[] = '- ' . $link->render();
		}

		return $this->type . \PHP_EOL . \implode( \PHP_EOL, $rendered_links );
	}
}
