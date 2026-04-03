<?php
namespace GEO\Engine;

class Scoring {
    public function calculate($content, $entities = []) {
        $clean_content = strip_tags($content, '<h2><h3><ul><ol><li><p><br><strong><em>');
        $text_only = strip_tags($content);

        $clarity = $this->score_clarity($text_only);
        $structure = $this->score_structure($clean_content);
        $entity_score = $this->score_entities($entities);
        $snippet = $this->score_snippet($clean_content);
        $readability = $this->score_readability($text_only);

        $total = $clarity + $structure + $entity_score + $snippet + $readability;

        return [
            'total' => min(100, max(0, $total)),
            'breakdown' => [
                'clarity' => $clarity,
                'structure' => $structure,
                'entities' => $entity_score,
                'snippet' => $snippet,
                'readability' => $readability
            ]
        ];
    }

    private function score_clarity($text) {
        $score = 0;
        $words = explode(' ', trim($text));
        $first_150 = implode(' ', array_slice($words, 0, 150));

        // Check if there is a direct answer early on (is, are, means, refers to, etc.)
        if (preg_match('/\b(is|are|means|refers to|can be defined as|represents)\b/i', $first_150)) {
            $score += 15;
        }

        // Check if the content starts directly without fluff (e.g., checking if the first sentence is relatively short/direct)
        $sentences = preg_split('/[.!?]/', $first_150, -1, PREG_SPLIT_NO_EMPTY);
        if (!empty($sentences) && str_word_count($sentences[0]) < 20) {
            $score += 10;
        }

        return min(25, $score);
    }

    private function score_structure($html) {
        $score = 0;

        if (preg_match('/<h[23]/i', $html)) {
            $score += 5;
        }

        if (preg_match('/<(ul|ol)>.*<li>/is', $html)) {
            $score += 5;
        }

        // Check for short paragraphs
        preg_match_all('/<p>(.*?)<\/p>/is', $html, $paragraphs);
        $short_paragraphs = 0;
        $total_paragraphs = count($paragraphs[1]);

        if ($total_paragraphs > 0) {
            foreach ($paragraphs[1] as $p) {
                if (str_word_count(strip_tags($p)) < 50) { // Approx 3-4 lines
                    $short_paragraphs++;
                }
            }
            if ($short_paragraphs / $total_paragraphs > 0.5) {
                $score += 10;
            } else {
                $score += 5;
            }
        }

        return min(20, $score);
    }

    private function score_entities($entities) {
        $count = count($entities);
        if ($count >= 5) {
            return 20;
        } elseif ($count >= 3) {
            return 15;
        } elseif ($count >= 1) {
            return 10;
        }
        return 0;
    }

    private function score_snippet($html) {
        $score = 0;

        // Look for concise definition (e.g. bold term followed by explanation or paragraph under H2)
        if (preg_match('/<h2>.*?<\/h2>\s*<p>[^<]{10,200}<\/p>/is', $html) || preg_match('/<strong>.*?<\/strong>([^<]{10,150})/', $html)) {
            $score += 10;
        }

        // FAQ like section (H3 followed by short P or List)
        if (preg_match('/<h3>.*?<\/h3>\s*(?:<p>|<ol>|<ul>)/is', $html) || stripos($html, 'faq') !== false || stripos($html, 'frequently asked') !== false) {
            $score += 10;
        }

        return min(20, $score);
    }

    private function score_readability($text) {
        $score = 15;
        $sentences = preg_split('/[.!?]/', $text, -1, PREG_SPLIT_NO_EMPTY);
        if (empty($sentences)) return 0;

        $long_sentences = 0;
        foreach ($sentences as $s) {
            if (str_word_count($s) > 25) {
                $long_sentences++;
            }
        }

        $ratio = $long_sentences / count($sentences);
        if ($ratio > 0.3) {
            $score -= 10;
        } elseif ($ratio > 0.15) {
            $score -= 5;
        }

        return max(0, $score);
    }
}
