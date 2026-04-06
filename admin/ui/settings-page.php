<?php
namespace GEO\Admin\UI;

class Settings_Page {
    public function register() {
        add_action('admin_menu', [$this, 'add_menu_page']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function add_menu_page() {
        add_menu_page(
            esc_html__('AI SEO Settings', 'geo-plugin'),
            esc_html__('AI SEO', 'geo-plugin'),
            'manage_options',
            'geo-settings',
            [$this, 'render_page'],
            'dashicons-superhero',
            30
        );
    }

    public function register_settings() {
        register_setting('geo_settings_group', 'geo_enable_analysis');
        register_setting('geo_settings_group', 'geo_engine_mode');
        register_setting('geo_settings_group', 'geo_api_key');

        add_settings_section(
            'geo_main_section',
            esc_html__('General Settings', 'geo-plugin'),
            null,
            'geo-settings'
        );

        add_settings_field(
            'geo_enable_analysis',
            esc_html__('Enable GEO Analysis', 'geo-plugin'),
            [$this, 'render_enable_field'],
            'geo-settings',
            'geo_main_section'
        );

        add_settings_field(
            'geo_engine_mode',
            esc_html__('Engine Mode', 'geo-plugin'),
            [$this, 'render_mode_field'],
            'geo-settings',
            'geo_main_section'
        );

        add_settings_field(
            'geo_api_key',
            esc_html__('API Key', 'geo-plugin'),
            [$this, 'render_api_key_field'],
            'geo-settings',
            'geo_main_section'
        );
    }

    public function render_enable_field() {
        $value = get_option('geo_enable_analysis', '1');
        echo '<label><input type="checkbox" name="geo_enable_analysis" value="1" ' . checked(1, $value, false) . ' /> ' . esc_html__('Analyze posts in editor', 'geo-plugin') . '</label>';
    }

    public function render_mode_field() {
        $value = get_option('geo_engine_mode', 'local');
        $is_pro = defined('GEO_PRO') && GEO_PRO === true;

        echo '<label><input type="radio" name="geo_engine_mode" value="local" ' . checked('local', $value, false) . ' /> ' . esc_html__('Local Engine (Fast, Free)', 'geo-plugin') . '</label><br>';

        if ($is_pro) {
            echo '<label><input type="radio" name="geo_engine_mode" value="api" ' . checked('api', $value, false) . ' /> ' . esc_html__('Cloud SaaS API', 'geo-plugin') . '</label>';
        } else {
            echo '<label style="color: #8c8f94;"><input type="radio" name="geo_engine_mode" value="api" disabled /> ' . esc_html__('Cloud SaaS API (Pro feature)', 'geo-plugin') . '</label>';
        }
    }

    public function render_api_key_field() {
        $value = get_option('geo_api_key', '');
        $mode = get_option('geo_engine_mode', 'local');
        $display = $mode === 'api' ? 'block' : 'none';
        echo '<input type="password" name="geo_api_key" value="' . esc_attr($value) . '" class="regular-text" style="display:' . $display . ';" id="geo_api_key_input" />';
        echo '<p class="description" style="display:' . $display . ';" id="geo_api_key_desc">' . esc_html__('Enter your SaaS API key to unlock advanced analysis.', 'geo-plugin') . '</p>';

        // Inline script to toggle API key visibility
        echo '<script>
            document.addEventListener("DOMContentLoaded", function() {
                const radios = document.querySelectorAll("input[name=\'geo_engine_mode\']");
                const apiKeyInput = document.getElementById("geo_api_key_input");
                const apiKeyDesc = document.getElementById("geo_api_key_desc");

                radios.forEach(radio => {
                    radio.addEventListener("change", function() {
                        if (this.value === "api") {
                            apiKeyInput.style.display = "block";
                            apiKeyDesc.style.display = "block";
                        } else {
                            apiKeyInput.style.display = "none";
                            apiKeyDesc.style.display = "none";
                        }
                    });
                });
            });
        </script>';
    }

    public function render_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap" style="max-width: 600px; background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1><?php esc_html_e('AI Search Optimization (GEO)', 'geo-plugin'); ?></h1>
                <?php if (!defined('GEO_PRO') || GEO_PRO === false) : ?>
                    <a href="https://example.com/upgrade" target="_blank" class="button button-primary" style="background: #8e24aa; border-color: #8e24aa;"><?php esc_html_e('Upgrade to Pro', 'geo-plugin'); ?></a>
                <?php endif; ?>
            </div>
            <p><?php esc_html_e('Prepare your content to rank in AI generated answers like ChatGPT and Google SGE.', 'geo-plugin'); ?></p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <form action="options.php" method="post">
                <?php
                settings_fields('geo_settings_group');
                do_settings_sections('geo-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
}
