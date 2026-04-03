<?php
require_once 'geo/entity-extractor.php';
require_once 'geo/scoring.php';
require_once 'geo/suggestions.php';
require_once 'geo/geo-engine.php';

use GEO\Engine\Entity_Extractor;
use GEO\Engine\Scoring;
use GEO\Engine\Suggestions;
use GEO\Engine\GEO_Engine;

$html = <<<HTML
<h2>What is Generative Engine Optimization?</h2>
<p>Generative Engine Optimization (GEO) is the process of optimizing content to rank highly in AI-generated answers and summaries provided by engines like Google SGE, ChatGPT, or Claude. It involves clear structure and facts.</p>
<h3>Core Concepts</h3>
<ul>
    <li>Entity density</li>
    <li>Direct answers</li>
    <li>Structured data</li>
</ul>
<p>In New York and San Francisco, GEO is becoming the new standard. Many agencies are pivoting from traditional SEO to GEO.</p>
<h2>FAQ</h2>
<h3>Is GEO replacing SEO?</h3>
<p>No, it is an evolution. Traditional ranking factors still matter.</p>
HTML;

$extractor = new Entity_Extractor();
$scorer = new Scoring();
$suggester = new Suggestions();

$engine = new GEO_Engine($extractor, $scorer, $suggester);

$start = microtime(true);
$result = $engine->analyze($html);
$end = microtime(true);

$time_ms = round(($end - $start) * 1000, 2);

echo "Execution time: {$time_ms} ms\n\n";
echo json_encode($result, JSON_PRETTY_PRINT);
echo "\n";
