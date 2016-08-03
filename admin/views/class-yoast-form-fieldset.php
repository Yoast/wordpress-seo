<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Generate the HTML for a form fieldset to wrap grouped form elements.
 */
class Yoast_Form_Fieldset implements Yoast_Form_Element {

	/**
	 * @var string
	 */
	private $fieldset_id;

	/**
	 * @var array The fieldset HTML attributes.
	 */
	private $fieldset_attributes = array();

	/**
	 * @var array The legend HTML attributes.
	 */
	private $legend_attributes = array();

	/**
	 * @var string A translatable string for the fieldset legend content.
	 */
	private $legend_content;

	/**
	 * @var string The grouped form elements for the fieldset.
	 */
	private $fieldset_content;

	/**
	 * Constructor.
	 *
	 * @param string $fieldset_id      ID for the fieldset.
	 * @param string $legend_content   The translatable legend text.
	 * @param string $fieldset_content The grouped form elements for the fieldset.
	 */
	public function __construct( $fieldset_id, $legend_content, $fieldset_content ) {
		$this->fieldset_id      = $fieldset_id;
		$this->legend_content   = $legend_content;
		$this->fieldset_content = $fieldset_content;
	}

	/**
	 * Render the view.
	 */
	public function render_view() {
		/*
		 * Extract because we want values accessible via variables for later use
		 * in the view instead of accessing them as an array.
		 */
		extract( $this->get_fieldset_parts() );

		require( dirname( WPSEO_FILE ) . '/admin/views/form/fieldset.php' );
	}

	/**
	 * Start output buffering to catch the form elements to wrap in the fieldset.
	 */
	public function start() {
		ob_start();
	}

	/**
	 * Return output buffering with the form elements to wrap in the fieldset.
	 */
	public function end() {
		$this->fieldset_content = ob_get_clean();
	}

	/**
	 * Return the rendered view.
	 *
	 * @return string
	 */
	public function get_html() {
		return $this->render_view();
	}

	/**
	 * Output the rendered view.
	 */
	public function html() {
		echo $this->get_html();
	}

	/**
	 * Add an attribute to the fieldset attributes property.
	 *
	 * @param string $attribute The name of the attribute to add.
	 * @param string $value     The value of the attribute.
	 */
	public function fieldset_add_attribute( $attribute, $value ) {
		$this->fieldset_attributes[ $attribute ] = $value;
	}

	/**
	 * Add an attribute to the legend attributes property.
	 *
	 * @param string $attribute The name of the attribute to add.
	 * @param string $value     The value of the attribute.
	 */
	public function legend_add_attribute( $attribute, $value ) {
		$this->legend_attributes[ $attribute ] = $value;
	}

	/**
	 * Return the set of attributes and content for the fieldset.
	 *
	 * @return array
	 */
	private function get_fieldset_parts() {
		return array(
			'id'                  => $this->fieldset_id,
			'fieldset_attributes' => $this->get_attributes( $this->fieldset_attributes ),
			'legend_content'      => $this->legend_content,
			'legend_attributes'   => $this->get_attributes( $this->legend_attributes ),
			'content'             => $this->fieldset_content,
		);
	}

	/**
	 * Return HTML attributes as a string, when there are attributes set.
	 *
	 * @param array $attributes Fieldset or legend attributes.
	 *
	 * @return string A space separated list of HTML attributes or empty string.
	 */
	private function get_attributes( $attributes ) {
		if ( ! empty( $attributes ) ) {
			array_walk( $attributes, array( $this, 'parse_attribute' ) );

			// Use an initial space as `implode()` adds a space only between array elements.
			return ' ' . implode( ' ', $attributes );
		}

		return '';
	}

	/**
	 * Get an attribute from the attributes and escape it.
	 *
	 * @param string $value     The value of the attribute.
	 * @param string $attribute The attribute to look for.
	 */
	private function parse_attribute( & $value, $attribute ) {
		$value = sprintf( '%s="%s"', esc_html( $attribute ), esc_attr( $value ) );
	}
}
