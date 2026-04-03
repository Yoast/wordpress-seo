<?php
namespace GEO\Engine;

class Entity_Extractor {
    public function extract($content) {
        $content = strip_tags($content);
        $entities = [];

        // MVP: Regex to find capitalized words (Potential proper nouns/entities),
        // avoiding words at the start of sentences where possible
        // Matches Capitalized words that are not immediately following a punctuation mark (. ! ?)
        // and a space.

        // Also capture 2-3 word capitalized phrases (e.g., "New York", "Machine Learning")
        preg_match_all('/(?<![.!?]\s)\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/', $content, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $match) {
                // Ignore single character entities or common stop words that might be capitalized
                if (strlen($match) > 2) {
                    $entities[] = trim($match);
                }
            }
        }

        // Count frequencies and return unique entities
        $counts = array_count_values($entities);
        arsort($counts);

        return array_keys($counts);
    }
}
