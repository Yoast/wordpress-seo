<?php
namespace GEO\Engine;

class GEO_Engine {
    private $extractor;
    private $scorer;
    private $suggester;
    private $summarizer;

    public function __construct(Entity_Extractor $extractor, Scoring $scorer, Suggestions $suggester, Summarizer $summarizer) {
        $this->extractor = $extractor;
        $this->scorer = $scorer;
        $this->suggester = $suggester;
        $this->summarizer = $summarizer;
    }

    public function analyze($content) {
        if (empty(trim(strip_tags($content)))) {
             return [
                'score' => 0,
                'breakdown' => [
                    'clarity' => 0,
                    'structure' => 0,
                    'entities' => 0,
                    'snippet' => 0,
                    'readability' => 0
                ],
                'suggestions' => ['Content is empty. Please add text to analyze.'],
                'ai_answer' => 'No content to preview.'
            ];
        }

        // Run full GEO analysis
        $entities = $this->extractor->extract($content);
        $scoring_result = $this->scorer->calculate($content, $entities);

        $main_topic = !empty($entities) ? $entities[0] : 'your main topic';

        $suggestions = $this->suggester->generate($scoring_result['breakdown'], $content, $entities, $main_topic);
        $ai_answer = $this->summarizer->generate($content, $entities);

        // Ensure all string outputs are sanitized/escaped before sending back
        $sanitized_suggestions = array_map('esc_html', $suggestions);
        $sanitized_ai_answer = esc_html($ai_answer);

        return [
            'score' => absint($scoring_result['total']),
            'breakdown' => array_map('absint', $scoring_result['breakdown']),
            'suggestions' => $sanitized_suggestions,
            'ai_answer' => $sanitized_ai_answer
        ];
    }
}
