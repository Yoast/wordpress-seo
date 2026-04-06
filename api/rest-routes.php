<?php
namespace GEO\API;

use GEO\Engine\GEO_Engine;
use GEO\Engine\Entity_Extractor;
use GEO\Engine\Scoring;
use GEO\Engine\Suggestions;
use GEO\Engine\Summarizer;
use GEO\Services\License_Manager;

class Rest_Routes {
    public function register() {
        register_rest_route('geo/v1', '/analyze', [
            'methods'             => 'POST',
            'callback'            => [$this, 'analyze_post'],
            'permission_callback' => [$this, 'check_permissions'],
            'args'                => [
                'post_id' => [
                    'required'          => true,
                    'type'              => 'integer',
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param, $request, $key) {
                        return is_numeric($param);
                    }
                ],
                'content' => [
                    'required'          => true,
                    'type'              => 'string',
                    'sanitize_callback' => function($param, $request, $key) {
                        // Use wp_kses_post to sanitize incoming HTML safely.
                        // For raw text, sanitize_text_field could be used, but since we expect editor HTML, wp_kses_post is correct.
                        return wp_kses_post($param);
                    }
                ]
            ]
        ]);
    }

    public function check_permissions(\WP_REST_Request $request) {
        $post_id = $request->get_param('post_id');
        if (!$post_id) {
            return false;
        }

        return current_user_can('edit_post', $post_id);
    }

    public function analyze_post(\WP_REST_Request $request) {
        $post_id = $request->get_param('post_id');
        $content = $request->get_param('content') ?? '';

        if (empty(trim(strip_tags($content)))) {
            return rest_ensure_response([
                'score' => 0,
                'breakdown' => [
                    'clarity' => 0,
                    'structure' => 0,
                    'entities' => 0,
                    'snippet' => 0,
                    'readability' => 0
                ],
                'suggestions' => [esc_html__('Content is empty. Please add text to analyze.', 'geo-plugin')],
                'ai_answer' => esc_html__('No content to preview.', 'geo-plugin')
            ]);
        }

        // Transient caching for 60s based on post ID and content hash
        $content_hash = md5($content);
        $cache_key = 'geo_score_' . $post_id . '_' . $content_hash;
        $cached_result = get_transient($cache_key);

        if (false !== $cached_result) {
            return rest_ensure_response($cached_result);
        }

        try {
            $license_manager = new License_Manager();
            $is_pro = $license_manager->is_pro_active();

            $extractor = new Entity_Extractor();
            $scorer = new Scoring();
            $suggester = new Suggestions();
            $summarizer = new Summarizer();

            $engine = new GEO_Engine($extractor, $scorer, $suggester, $summarizer, $is_pro);
            $result = $engine->analyze($content);
            $result['is_pro'] = $is_pro; // Return license state for frontend handling

            // Set transient for 60 seconds
            set_transient($cache_key, $result, 60);

            return rest_ensure_response($result);
        } catch (\Exception $e) {
            return new \WP_Error('geo_engine_error', esc_html__('Failed to analyze content.', 'geo-plugin'), ['status' => 500]);
        }
    }
}
