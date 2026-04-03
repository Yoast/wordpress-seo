<?php
namespace GEO\Engine;

class Suggestions {
    public function generate($breakdown) {
        $suggestions = [];

        if ($breakdown['clarity'] < 15) {
            $suggestions[] = "Add a direct answer in the first paragraph.";
        }

        if ($breakdown['structure'] < 15) {
            if ($breakdown['structure'] < 5) {
                $suggestions[] = "Use headings (H2, H3) to structure your content.";
            }
            $suggestions[] = "Use shorter paragraphs (max 3-4 lines) and bullet points.";
        }

        if ($breakdown['entities'] < 10) {
            $suggestions[] = "Include more specific entities (people, places, concepts) relevant to your topic.";
        }

        if ($breakdown['snippet'] < 10) {
            $suggestions[] = "Add a concise definition or a summary paragraph early on.";
            $suggestions[] = "Consider adding an FAQ section.";
        }

        if ($breakdown['readability'] < 10) {
            $suggestions[] = "Simplify your sentences. Avoid long, complex sentences.";
        }

        // Ensure max 5 items
        return array_slice($suggestions, 0, 5);
    }
}
