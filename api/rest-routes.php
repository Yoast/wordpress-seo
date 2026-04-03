<?php
namespace GEO\API;

use GEO\Engine\GEO_Engine;
use GEO\Engine\Entity_Extractor;
use GEO\Engine\Scoring;
use GEO\Engine\Suggestions;
use GEO\Engine\Summarizer;

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
        $content = $request->get_param('content') ?? '';

        $extractor = new Entity_Extractor();
        $scorer = new Scoring();
        $suggester = new Suggestions();
        $summarizer = new Summarizer();

        $engine = new GEO_Engine($extractor, $scorer, $suggester, $summarizer);
        $result = $engine->analyze($content);

        return rest_ensure_response($result);
    }
}
