<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Light_Switch_Presenter.
 *
 * @package Yoast\WP\SEO\Presenters\Admin
 */
class Light_Switch_Presenter extends Abstract_Presenter {

	/**
	 * The short link helper.
	 *
	 * @var string
	 */
	protected $var;

	/**
	 * Light_Switch_Presenter constructor.
	 *
	 * @param string      $var                The variable to create the checkbox for.
	 * @param string      $label              The label element text for the checkbox.
	 * @param string      $off_button         Visual label for the "off" button (defaults to Disabled).
	 * @param string      $on_button          Visual label for the "on" button (defaults to Enabled).
	 * @param string      $name               The name of the toggle underlying option.
	 * @param string|bool $val                Value to determine the checked attribute.
	 * @param bool        $disabled_attribute Whether the toggle is disabled.
	 * @param string      $class              The CSS class for the toggle.
	 * @param string      $help               Inline Help that will be printed out before the visible toggle text.
	 * @param string      $help_class         The CSS class for the help.
	 * @param bool        $strong_class       Whether the visual label is displayed in strong text. Default is false.
	 */
	public function __construct(
		$var,
		$label,
		$off_button,
		$on_button,
		$name,
		$val,
		$disabled_attribute,
		$class,
		$help,
		$help_class,
		$strong_class
	) {
		$this->var                = $var;
		$this->label              = $label;
		$this->off_button         = $off_button;
		$this->on_button          = $on_button;
		$this->name               = $name;
		$this->val                = $val;
		$this->disabled_attribute = $disabled_attribute;
		$this->class              = $class;
		$this->help               = $help;
		$this->help_class         = $help_class;
		$this->strong_class       = $strong_class;
	}

	/**
	 * Presents the light switch toggle.
	 *
	 * @return string The list item HTML.
	 */
	public function present() {
		$output  = '<div class="switch-container' . $this->help_class . '">';
		$output .= '<span class="switch-light-visual-label' . $this->strong_class . '" id="' . esc_attr( $this->var . '-label' ) . '">' . esc_html( $this->label ) . '</span>' . $this->help;
		$output .= '<label class="' . $this->class . '"><b class="switch-yoast-seo-jaws-a11y">&nbsp;</b>';
		// phpcs:ignore WordPress.Security.EscapeOutput -- Reason: $disabled_attribute output is hardcoded and all other output is properly escaped.
		$output .= '<input type="checkbox" aria-labelledby="' . esc_attr( $this->var . '-label' ) . '" id="' . esc_attr( $this->var ) . '" name="' . esc_attr( $this->name ) . '[' . esc_attr( $this->var ) . ']" value="on"' . checked( $this->val, 'on', false ) . $this->disabled_attribute . '/>';
		$output .= '<span aria-hidden="true">';
		$output .= '<span>' . esc_html( $this->off_button ) . '</span>';
		$output .= '<span>' . esc_html( $this->on_button ) . '</span>';
		$output .= '<a></a>';
		$output .= '</span></label><div class="clear"></div></div>';

		return $output;
	}
}
