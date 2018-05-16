<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This class handles the Breadcrumbs generation and display.
 */
class WPSEO_Breadcrumbs {
	
	/**
	 * @var    object    Instance of this class
	 */
	public static $instance;
	
	/**
	 * @var string    Last used 'before' string
	 */
	public static $before = '';
	
	/**
	 * @var string    Last used 'after' string
	 */
	public static $after = '';
	
	/**
	 * @var    string    Blog's show on front setting, 'page' or 'posts'
	 */
	private $show_on_front;
	
	/**
	 * @var    mixed    Blog's page for posts setting, page id or false
	 */
	private $page_for_posts;
	
	/**
	 * @var mixed    Current post object
	 */
	private $post;
	
	/**
	 * @var string    HTML wrapper element for a single breadcrumb element
	 */
	private $element = 'span';
	
	/**
	 * @var string    Yoast SEO breadcrumb separator
	 */
	private $separator = '';
	
	/**
	 * @var string    HTML wrapper element for the Yoast SEO breadcrumbs output
	 */
	private $wrapper = 'span';
	
	/**
	 * @var array    Count of the elements in the $crumbs property
	 */
	private $crumb_count = 0;
	
	/**
	 * @var array    Array of individual (linked) html strings created from crumbs
	 */
	private $links = array();
	
	/**
	 * @var    string    Breadcrumb html string
	 */
	private $output;
	
	
	/**
	 * Create the breadcrumb.
	 */
	protected function __construct() {
		$this->post           = ( isset($GLOBALS[ 'post' ]) ? $GLOBALS[ 'post' ] : null );
		$this->show_on_front  = get_option('show_on_front');
		$this->page_for_posts = get_option('page_for_posts');
		$this->links          = WPSEO_Breadcrumbs_Logic::breadcrumb_array();
		
		$this->crumb_count = count($this->links);
		
		$this->filter_element();
		$this->filter_separator();
		$this->filter_wrapper();
		
		$this->prepare_links();
		$this->links_to_string();
		$this->wrap_breadcrumb();
	}
	
	/**
	 * Get breadcrumb string using the singleton instance of this class.
	 *
	 * @param string $before Optional string to prepend.
	 * @param string $after Optional string to append.
	 * @param bool   $display Echo or return flag.
	 *
	 * @return string Returns the breadcrumbs as a string.
	 */
	public static function breadcrumb( $before = '', $after = '', $display = true ) {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}
		// Remember the last used before/after for use in case the object goes __toString().
		self::$before = $before;
		self::$after  = $after;
		
		$output = $before . self::$instance->output . $after;
		
		if ( $display === true ) {
			echo $output;
			
			return '';
		}
		
		return $output;
	}
	
	/**
	 * Magic method to use in case the class would be send to string.
	 *
	 * @return string
	 */
	public function __toString() {
		return self::$before . $this->output . self::$after;
	}
	
	/**
	 * Filter: 'wpseo_breadcrumb_single_link_wrapper' - Allows developer to change or wrap each breadcrumb element.
	 *
	 * @api string $element
	 */
	private function filter_element() {
		$this->element = esc_attr(apply_filters('wpseo_breadcrumb_single_link_wrapper', $this->element));
	}
	
	/**
	 * Filter: 'wpseo_breadcrumb_separator' - Allow (theme) developer to change the Yoast SEO breadcrumb separator.
	 *
	 * @api string $breadcrumbs_sep Breadcrumbs separator.
	 */
	private function filter_separator() {
		$separator       = apply_filters('wpseo_breadcrumb_separator', WPSEO_Options::get('breadcrumbs-sep'));
		$this->separator = ' ' . $separator . ' ';
	}
	
	/**
	 * Filter: 'wpseo_breadcrumb_output_wrapper' - Allow changing the HTML wrapper element for the Yoast SEO breadcrumbs output.
	 *
	 * @api string $wrapper The wrapper element.
	 */
	private function filter_wrapper() {
		$wrapper = apply_filters('wpseo_breadcrumb_output_wrapper', $this->wrapper);
		$wrapper = tag_escape($wrapper);
		if ( is_string($wrapper) && '' !== $wrapper ) {
			$this->wrapper = $wrapper;
		}
	}
	
	/**
	 * Take the crumbs array and convert each crumb to a single breadcrumb string.
	 *
	 * @link http://support.google.com/webmasters/bin/answer.py?hl=en&answer=185417 Google documentation on RDFA
	 */
	private function prepare_links() {
		if ( ! is_array($this->links) || $this->links === array() ) {
			return;
		}
		
		$prepared_links = array();
		
		foreach ( $this->links as $index => $crumb ) {
			
			$link_info = $crumb; // Keep pre-set url/text combis.
			
			$prepared_links[ $index ] = $this->crumb_to_link($link_info, $index);
		}
		
		$this->links = $prepared_links;
	}
	
	/**
	 * Create a breadcrumb element string.
	 *
	 * @todo The `$paged` variable only works for archives, not for paged articles, so this does not work
	 * for paged article at this moment.
	 *
	 * @param  array $link Link info array containing the keys:
	 *                     'text'    => (string) link text.
	 *                     'url'    => (string) link url.
	 *                     (optional) 'title'         => (string) link title attribute text.
	 *                     (optional) 'allow_html'    => (bool) whether to (not) escape html in the link text.
	 *                     This prevents html stripping from the text strings set in the
	 *                     WPSEO -> Internal Links options page.
	 * @param  int   $i Index for the current breadcrumb.
	 *
	 * @return string
	 */
	private function crumb_to_link( $link, $i ) {
		$link_output = '';
		
		if ( isset($link[ 'text' ]) && ( is_string($link[ 'text' ]) && $link[ 'text' ] !== '' ) ) {
			
			$link[ 'text' ] = trim($link[ 'text' ]);
			if ( ! isset($link[ 'allow_html' ]) || $link[ 'allow_html' ] !== true ) {
				$link[ 'text' ] = esc_html($link[ 'text' ]);
			}
			
			$inner_elm = 'span';
			if ( WPSEO_Options::get('breadcrumbs-boldlast') === true && $i === ( $this->crumb_count - 1 ) ) {
				$inner_elm = 'strong';
			}
			
			if ( ( isset($link[ 'url' ]) && ( is_string($link[ 'url' ]) && $link[ 'url' ] !== '' ) )
			     && ( $i < ( $this->crumb_count - 1 ) )
			) {
				if ( $i === 0 ) {
					$link_output .= '<' . $this->element . ' typeof="v:Breadcrumb">';
				} else {
					$link_output .= '<' . $this->element . ' rel="v:child" typeof="v:Breadcrumb">';
				}
				$title_attr  = isset($link[ 'title' ]) ? ' title="' . esc_attr($link[ 'title' ]) . '"' : '';
				$link_output .= '<a href="' . esc_url($link[ 'url' ]) . '" rel="v:url" property="v:title"' . $title_attr . '>' . $link[ 'text' ] . '</a>';
			} else {
				$link_output .= '<' . $inner_elm . ' class="breadcrumb_last">' . $link[ 'text' ] . '</' . $inner_elm . '>';
				// This is the last element, now close all previous elements.
				while ( $i > 0 ) {
					$link_output .= '</' . $this->element . '>';
					$i--;
				}
			}
		}
		
		/**
		 * Filter: 'wpseo_breadcrumb_single_link' - Allow changing of each link being put out by the Yoast SEO breadcrumbs class.
		 *
		 * @api string $link_output The output string.
		 *
		 * @param array $link The link array.
		 */
		
		return apply_filters('wpseo_breadcrumb_single_link', $link_output, $link);
	}
	
	
	/**
	 * Create a complete breadcrumb string from an array of breadcrumb element strings.
	 */
	private function links_to_string() {
		if ( is_array($this->links) && $this->links !== array() ) {
			// Remove any effectively empty links.
			$links = array_map('trim', $this->links);
			$links = array_filter($links);
			
			$this->output = implode($this->separator, $links);
		}
	}
	
	/**
	 * Wrap a complete breadcrumb string in a Breadcrumb RDFA wrapper.
	 */
	private function wrap_breadcrumb() {
		if ( is_string($this->output) && $this->output !== '' ) {
			$output = '<' . $this->wrapper . $this->get_output_id() . $this->get_output_class() . ' xmlns:v="http://rdf.data-vocabulary.org/#">' . $this->output . '</' . $this->wrapper . '>';
			
			/**
			 * Filter: 'wpseo_breadcrumb_output' - Allow changing the HTML output of the Yoast SEO breadcrumbs class.
			 *
			 * @api string $unsigned HTML output.
			 */
			$output = apply_filters('wpseo_breadcrumb_output', $output);
			
			if ( WPSEO_Options::get('breadcrumbs-prefix') !== '' ) {
				$output = "\t" . WPSEO_Options::get('breadcrumbs-prefix') . "\n" . $output;
			}
			
			$this->output = $output;
		}
	}
	
	
	/**
	 * Filter: 'wpseo_breadcrumb_output_id' - Allow changing the HTML ID on the Yoast SEO breadcrumbs wrapper element.
	 *
	 * @api string $unsigned ID to add to the wrapper element.
	 */
	private function get_output_id() {
		$id = apply_filters('wpseo_breadcrumb_output_id', '');
		if ( is_string($id) && '' !== $id ) {
			$id = ' id="' . esc_attr($id) . '"';
		}
		
		return $id;
	}
	
	/**
	 * Filter: 'wpseo_breadcrumb_output_class' - Allow changing the HTML class on the Yoast SEO breadcrumbs wrapper element.
	 *
	 * @api string $unsigned Class to add to the wrapper element.
	 */
	private function get_output_class() {
		$class = apply_filters('wpseo_breadcrumb_output_class', '');
		if ( is_string($class) && '' !== $class ) {
			$class = ' class="' . esc_attr($class) . '"';
		}
		
		return $class;
	}
}
