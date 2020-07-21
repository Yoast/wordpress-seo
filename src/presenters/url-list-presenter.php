<?php
/**
 * Presenter class for the document title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

/**
 * Class Url_List_Presenter
 */
class Url_List_Presenter extends Abstract_Presenter {
	/**
	 * @var array A list of arrays containing titles and urls.
	 */
	private $links;

	/**
	 * @var string Classname for the url list.
	 */
	private $class_name;

	/**
	 * Url_List_Presenter constructor.
	 *
	 * @param array  $links A list of arrays containing titles and urls.
	 * @param string $class_name Classname for the url list.
	 */
	public function __construct( $links, $class_name = 'yoast-url-list' ) {
		$this->links = $links;
		$this->class_name = $class_name;
	}

	/**
	 * @return string
	 */
	public function present() {
		$output = '<ul class="' . $this->class_name . '">';
		foreach ( $this->links as $link ) {
			$output .= '<li><a href="' . $link['permalink'] . '">' . $link['title'] . '</a></li>';
		}
		$output .= '</ul>';
		return $output;
	}
}
