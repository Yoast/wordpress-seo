<?php

namespace Yoast\WP\SEO\Services\Health_Check\Default_Tagline;

use Yoast\WP\SEO\Services\Health_Check\Health_Check_Result_Builder;

class Health_Check_Default_Tagline_Presenter {
	private $test_name;

	public function __construct($test_name) {
		$this->test_name = $test_name;
	}

	public function get_success_result() {
		$result_builder = $this->get_result_builder();
		return $result_builder
			->set_test_name($this->test_name)
			->set_label(esc_html__( 'You changed the default WordPress tagline', 'wordpress-seo' ))
			->set_status_good()
			->set_description(esc_html__( 'You are using a custom tagline or an empty one.', 'wordpress-seo' ))
			->build();
	}

	public function get_has_default_tagline_result() {
		$result_builder = $this->get_result_builder();
		return $result_builder
			->set_test_name($this->test_name)
			->set_label(esc_html__( 'You should change the default WordPress tagline', 'wordpress-seo' ))
			->set_status_recommended()
			->set_description(esc_html__( 'You still have the default WordPress tagline. Even an empty one is probably better.', 'wordpress-seo' ))
			->set_actions($this->get_actions())
			->build();
	}

	private function get_result_builder() {
		$result_builder = new Health_Check_Result_Builder();
		return $result_builder->set_test_name($this->test_name);
	}

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