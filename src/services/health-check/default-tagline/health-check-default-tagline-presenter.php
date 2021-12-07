<?php

namespace Yoast\WP\SEO\Services\Health_Check\Default_Tagline;

use Yoast\WP\SEO\Services\Health_Check\Health_Check_Result_Builder;

/**
 * Health_Check_Default_Tagline_Presenter
 */
class Health_Check_Default_Tagline_Presenter {	

	/**
	 * test_name
	 *
	 * @var string
	 */
	private $test_identifier;
	
	/**
	 * result_builder
	 *
	 * @var mixed
	 */
	private $result_builder;
	
	/**
	 * __construct
	 *
	 * @param  mixed $result_builder
	 * @return void
	 */
	public function __construct(Health_Check_Result_Builder $result_builder) {
		$this->result_builder = $result_builder;
	}
	
	/**
	 * set_test_identifier
	 *
	 * @param  string $test_identifier
	 * @return void
	 */
	public function set_test_identifier($test_identifier) {
		$this->test_identifier = $test_identifier;
		$this->result_builder->set_test_identifier($this->test_identifier);
	}
	
	/**
	 * get_success_result
	 *
	 * @return string[]
	 */
	public function get_success_result() {
		return $this->result_builder
			->set_label(esc_html__( 'You changed the default WordPress tagline', 'wordpress-seo' ))
			->set_status_good()
			->set_description(esc_html__( 'You are using a custom tagline or an empty one.', 'wordpress-seo' ))
			->build();
	}
	
	/**
	 * get_has_default_tagline_result
	 *
	 * @return string[]
	 */
	public function get_has_default_tagline_result() {
		return $this->result_builder
			->set_label(esc_html__( 'You should change the default WordPress tagline', 'wordpress-seo' ))
			->set_status_recommended()
			->set_description(esc_html__( 'You still have the default WordPress tagline. Even an empty one is probably better.', 'wordpress-seo' ))
			->set_actions($this->get_actions())
			->build();
	}
	
	/**
	 * get_actions
	 *
	 * @return string
	 */
	private function get_actions() {
		$query_args    = [
			'autofocus[control]' => 'blogdescription',
		];
		$customize_url = add_query_arg( $query_args, wp_customize_url() );

		return sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			esc_html__( '%1$sYou can change the tagline in the customizer%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_attr( $customize_url ) . '">',
			'</a>'
		);
	}

}