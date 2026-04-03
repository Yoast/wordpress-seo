<?php
namespace GEO\API;

class Rest_Routes {
    public function register() {
        register_rest_route('geo/v1', '/analyze', [
            'methods' => 'POST',
            'callback' => [$this, 'analyze_post'],
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ]);
    }

    public function analyze_post(\WP_REST_Request $request) {
        $content = $request->get_param('content');

        // Pseudo code for dependency injection
        // $engine = new \GEO\Engine\GEO_Engine(...);
        // $result = $engine->analyze($content);

        return rest_ensure_response([
            'score' => 85,
            'suggestions' => ['Add FAQ schema', 'Use shorter paragraphs']
        ]);
    }
}
