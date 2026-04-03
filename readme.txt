=== AI Search Optimization Plugin (GEO) ===
Contributors: geo-team
Tags: seo, geo, ai search, chatgpt, optimization, sge
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv3 or later

Optimize your content to rank in AI generated answers like ChatGPT and Google SGE using Generative Engine Optimization (GEO).

== Description ==

Welcome to the future of search. Traditional SEO is evolving, and AI engines (like ChatGPT, Perplexity, and Google SGE) are increasingly answering user queries directly.

The **AI Search Optimization Plugin (GEO)** analyzes your content in real-time as you write, scoring it against a proprietary 5-factor AI readability rubric. It provides instant, context-aware suggestions to help format your posts so they are easily extracted and cited by Large Language Models (LLMs).

### Features

* **Real-time GEO Score (0-100)**: Instantly see how optimized your content is for AI extraction.
* **AI Answer Preview**: See a deterministic simulation of how an AI might summarize your post based on entity density and structure.
* **Actionable Suggestions**: Get specific, context-aware advice on where to add direct answers, bullet points, and FAQs.
* **Rewrite for AI**: Instantly restructure your content locally to improve your score.
* **Offline MVP**: The core analysis engine runs entirely on your own server. No external API dependencies or data privacy concerns for basic analysis.
* **Lightweight & Fast**: Built with pure vanilla JS and optimized PHP to ensure sub-300ms analysis times without bloating your editor.

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/` directory, or install the ZIP file directly through the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to **AI SEO** in the admin menu to review your settings.
4. Open any Post or Page in the Gutenberg or Classic Editor to see the GEO Analysis panel on the right sidebar.

== Frequently Asked Questions ==

= Does this replace traditional SEO? =
No. GEO (Generative Engine Optimization) works alongside traditional SEO. While traditional SEO helps you rank on search engine results pages, GEO ensures your content is structured optimally to be chosen as the source answer by AI conversational engines.

= Do I need an API key? =
For the MVP 1.0.0 release, all analysis is performed locally on your server using advanced NLP heuristics. No API key is required. Future pro versions will integrate SaaS APIs for deeper LLM analysis.

== Changelog ==

= 1.0.0 =
* Initial Public Release.
* Added 5-factor scoring rubric.
* Added Context-aware suggestions.
* Added AI Answer Preview generation.
* Added local AI Rewrite simulation.
