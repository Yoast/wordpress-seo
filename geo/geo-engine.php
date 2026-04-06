<?php
namespace GEO\Engine;

class GEO_Engine {
    private $extractor;
    private $scorer;
    private $suggester;
    private $summarizer;
    private $is_pro;

    public function __construct(Entity_Extractor $extractor, Scoring $scorer, Suggestions $suggester, Summarizer $summarizer, $is_pro = false) {
        $this->extractor = $extractor;
        $this->scorer = $scorer;
        $this->suggester = $suggester;
        $this->summarizer = $summarizer;
        $this->is_pro = $is_pro;
    }

    public function analyze($content) {
        $clean_text = trim(strip_tags($content));

        if (empty($clean_text)) {
             return [
                'score' => 0,
                'breakdown' => [
                    'clarity' => 0,
                    'structure' => 0,
                    'entities' => 0,
                    'snippet' => 0,
                    'readability' => 0
                ],
                'suggestions' => [esc_html__('No content to analyze.', 'geo-plugin')],
                'ai_answer' => esc_html__('No content to preview.', 'geo-plugin')
            ];
        }

        if (str_word_count($clean_text) < 15) {
             return [
                'score' => 0,
                'breakdown' => [
                    'clarity' => 0,
                    'structure' => 0,
                    'entities' => 0,
                    'snippet' => 0,
                    'readability' => 0
                ],
                'suggestions' => [esc_html__('Add more content for accurate AI scoring.', 'geo-plugin')],
                'ai_answer' => esc_html__('Content too short to generate preview.', 'geo-plugin')
            ];
        }

        // Run full GEO analysis
        $entities = $this->extractor->extract($content);
        $scoring_result = $this->scorer->calculate($content, $entities);

        $main_topic = !empty($entities) ? $entities[0] : 'your main topic';

        $suggestions = $this->suggester->generate($scoring_result['breakdown'], $content, $entities, $main_topic);
        $ai_answer = $this->summarizer->generate($content, $entities);

        // Feature Gating: Limit output for free users
        if (!$this->is_pro) {
            $suggestions = array_slice($suggestions, 0, 2); // Show only 2 suggestions in free tier

            // Limit AI answer preview to first sentence for free
            $ai_sentences = preg_split('/(?<=[.!?])\s+/', $ai_answer, -1, PREG_SPLIT_NO_EMPTY);
            if (!empty($ai_sentences)) {
                $ai_answer = $ai_sentences[0] . ' (Pro feature: Upgrade for full AI snippet simulation)';
            }
        }

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
