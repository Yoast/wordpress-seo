<?php
namespace GEO\Engine;

class Suggestions {
    public function generate($breakdown, $content, $entities = [], $topic = 'your main topic') {
        $suggestions = [];
        $text = strip_tags($content);
        $html = strtolower($content);

        // Ensure topic is clean and readable
        if (empty($topic) || $topic === 'This topic') {
            $topic = 'your main topic';
        }

        // 1. Detect missing answer
        if ($breakdown['clarity'] < 15) {
            $suggestions[] = "Add a 1-2 sentence direct answer to: {$topic} at the beginning.";
        }

        // 2. Entity-aware suggestions
        if ($breakdown['entities'] < 15) {
            if (!empty($entities)) {
                // Get up to 3 entities, skipping the main topic if it's the exact same string
                $related = array_filter($entities, function($e) use ($topic) {
                    return strcasecmp($e, $topic) !== 0;
                });
                $related = array_slice($related, 0, 3);

                if (!empty($related)) {
                    $suggestions[] = "Include related concepts such as: " . implode(', ', $related) . ".";
                } else {
                    $suggestions[] = "Expand on specific entities and proper nouns related to {$topic}.";
                }
            } else {
                $suggestions[] = "Include related concepts and proper nouns specific to {$topic}.";
            }
        }

        // 3. Structure-aware
        if (strpos($html, '<ul') === false && strpos($html, '<ol') === false) {
            $suggestions[] = "Convert key section into bullet points for better AI extraction.";
        } elseif ($breakdown['structure'] < 15) {
            $suggestions[] = "Break down long paragraphs into shorter 3-4 line chunks to improve structure around {$topic}.";
        }

        // 4. FAQ detection
        if (strpos($html, 'faq') === false && strpos($text, '?') === false && stripos($text, 'frequently asked') === false) {
            $suggestions[] = "Add a FAQ section answering common questions about {$topic}.";
        }

        // 5. Readability fallback
        if (count($suggestions) < 5 && $breakdown['readability'] < 10) {
            $suggestions[] = "Simplify complex sentences to ensure {$topic} is clearly parsed by AI models.";
        }

        // Ensure max 5 items
        return array_slice($suggestions, 0, 5);
    }
}
