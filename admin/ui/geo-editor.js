/**
 * GEO Editor Integration
 * Premium Vanilla JS UI for real-time GEO scoring in Gutenberg and Classic Editor
 */

document.addEventListener('DOMContentLoaded', () => {
    let timeoutId;
    let lastContent = '';
    let cachedResult = null;

    // Inject premium styles safely
    const styleBlock = document.createElement('style');
    styleBlock.innerHTML = `
        .geo-panel-inner { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
        .geo-header { font-size: 16px; font-weight: 600; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e4e7; color: #1d2327; }
        .geo-score-block { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; }
        .geo-score-number { font-size: 42px; font-weight: 700; line-height: 1; }
        .geo-score-label { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        .score-green { color: #00a32a; }
        .score-yellow { color: #dba617; }
        .score-red { color: #d63638; }

        .geo-visibility { font-size: 14px; font-weight: 500; margin-bottom: 20px; padding: 10px; background: #f6f7f7; border-radius: 4px; text-align: center; border: 1px solid #c3c4c7; }

        .geo-suggestions-header { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #1d2327; }
        .geo-suggestions-list { margin: 0 0 20px 0; padding-left: 0; list-style: none; }
        .geo-suggestions-list li { font-size: 13px; line-height: 1.5; margin-bottom: 8px; padding-left: 24px; position: relative; color: #3c434a; }
        .geo-suggestions-list li::before { content: "•"; position: absolute; left: 8px; color: #d63638; font-size: 18px; top: -2px; }
        .geo-suggestions-list li.geo-perfect::before { color: #00a32a; content: "✓"; font-size: 14px; top: 0; }

        .geo-ai-preview-box { background: #f0f6fc; border-left: 4px solid #72aee6; padding: 12px 15px; border-radius: 0 4px 4px 0; margin-bottom: 20px; }
        .geo-ai-preview-header { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #0a4b78; margin: 0 0 6px 0; letter-spacing: 0.5px;}
        .geo-ai-preview-text { font-size: 13px; line-height: 1.6; color: #1d2327; margin: 0; font-family: Georgia, serif; }

        .geo-rewrite-btn { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 10px; border-radius: 4px; background: #2271b1; color: #fff; border: none; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .geo-rewrite-btn:hover { background: #135e96; }
        .geo-rewrite-btn:disabled { background: #a7aaad; cursor: not-allowed; }

        /* Modal Styles */
        .geo-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999999; display: none; align-items: center; justify-content: center; }
        .geo-modal { background: #fff; width: 600px; max-width: 90%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;}
        .geo-modal-header { padding: 15px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background: #f6f7f7;}
        .geo-modal-header h3 { margin: 0; font-size: 18px; color: #1d2327; }
        .geo-modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #787c82; line-height: 1;}
        .geo-modal-body { padding: 20px; overflow-y: auto; font-size: 14px; line-height: 1.6; }
        .geo-modal-footer { padding: 15px 20px; border-top: 1px solid #ddd; background: #f6f7f7; display: flex; justify-content: flex-end; gap: 10px;}
    `;
    document.head.appendChild(styleBlock);

    const panelContainer = document.getElementById('geo-editor-panel');
    if (!panelContainer) return;

    // Build premium UI layout safely
    panelContainer.innerHTML = `
        <div class="geo-panel-inner">
            <h2 class="geo-header">AI Search Optimization</h2>

            <div class="geo-score-block">
                <div class="geo-score-number" id="geo-score-value">--</div>
                <div style="text-align: right;">
                    <div class="geo-score-label" id="geo-score-label">Analyzing...</div>
                    <span id="geo-loading-indicator" style="display: none; color: #888; font-size: 12px;">Loading...</span>
                </div>
            </div>

            <div class="geo-visibility" id="geo-visibility">
                Estimated AI Visibility: <strong id="geo-visibility-level">--</strong>
            </div>

            <div id="geo-pro-upsell" style="display: none; font-size: 13px; text-align: center; margin-bottom: 20px;">
                <a href="https://example.com/upgrade" target="_blank" style="color: #8e24aa; font-weight: 600; text-decoration: none;">Unlock deeper AI optimization with Pro &rarr;</a>
            </div>

            <div class="geo-suggestions-header">Priority Suggestions</div>
            <ul class="geo-suggestions-list" id="geo-suggestions-list">
                <li>Waiting for content...</li>
            </ul>

            <div class="geo-ai-preview-box">
                <h4 class="geo-ai-preview-header">AI Answer Preview</h4>
                <p class="geo-ai-preview-text" id="geo-ai-preview">Waiting for content...</p>
            </div>

            <button id="geo-optimize-btn" class="geo-rewrite-btn">
                <span class="dashicons dashicons-admin-customizer" style="font-size: 16px; width: 16px; height: 16px; line-height: 1;"></span>
                Rewrite for AI Ranking
            </button>
        </div>
    `;

    // Append Modal to body
    const modalHTML = `
        <div class="geo-modal-overlay" id="geo-modal-overlay">
            <div class="geo-modal">
                <div class="geo-modal-header">
                    <h3>Optimized Version</h3>
                    <button class="geo-modal-close" id="geo-modal-close">&times;</button>
                </div>
                <div class="geo-modal-body" id="geo-modal-content" contenteditable="true" style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; min-height: 200px;">
                    <!-- Rewritten content goes here -->
                </div>
                <div class="geo-modal-footer">
                    <button class="button" id="geo-modal-cancel">Cancel</button>
                    <button class="button button-primary" id="geo-modal-apply">Apply Changes</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const scoreValue = document.getElementById('geo-score-value');
    const scoreLabel = document.getElementById('geo-score-label');
    const visibilityLevel = document.getElementById('geo-visibility-level');
    const loadingIndicator = document.getElementById('geo-loading-indicator');
    const suggestionsList = document.getElementById('geo-suggestions-list');
    const aiPreview = document.getElementById('geo-ai-preview');

    // Modal Elements
    const optimizeBtn = document.getElementById('geo-optimize-btn');
    const modalOverlay = document.getElementById('geo-modal-overlay');
    const modalClose = document.getElementById('geo-modal-close');
    const modalCancel = document.getElementById('geo-modal-cancel');
    const modalApply = document.getElementById('geo-modal-apply');
    const modalContent = document.getElementById('geo-modal-content');

    let simulatedContent = '';

    // --- Modal & Rewrite Logic ---
    const closeModal = () => { modalOverlay.style.display = 'none'; };
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);

    const simulateRewrite = (rawContent) => {
        // Strip out existing HTML wrappers for a clean slate
        let textLines = rawContent.replace(/<[^>]+>/g, '\n').split('\n').filter(l => l.trim().length > 0);
        if (textLines.length === 0) return "Please write some content first.";

        const mainTopic = cachedResult && cachedResult.ai_answer ? cachedResult.ai_answer.split(' ')[0] : 'The Topic';

        let rewritten = '';

        // 1. Add clear answer at top (H2 + paragraph)
        rewritten += `<h2>What is ${mainTopic}?</h2>\n`;
        rewritten += `<p>${cachedResult && cachedResult.ai_answer ? cachedResult.ai_answer : textLines[0]}</p>\n\n`;

        // 2. Break long paragraphs & Insert Bullet points
        rewritten += `<h3>Key Details</h3>\n<ul>\n`;
        for (let i = 1; i < Math.min(textLines.length, 4); i++) {
            if (textLines[i].length > 10) {
                rewritten += `  <li>${textLines[i].trim()}</li>\n`;
            }
        }
        rewritten += `</ul>\n\n`;

        // 3. Add small FAQ section
        rewritten += `<h2>Frequently Asked Questions</h2>\n`;
        rewritten += `<h3>Why is ${mainTopic} important?</h3>\n`;
        rewritten += `<p>It provides significant value and structure to the overall concept, allowing engines to parse it efficiently.</p>\n`;

        if (cachedResult && !cachedResult.is_pro) {
            rewritten += `\n<hr>\n<p><em><a href="https://example.com/upgrade" target="_blank" style="color: #8e24aa;">Upgrade to Pro to rewrite full article.</a></em></p>`;
        }

        return rewritten;
    };

    optimizeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let currentContent = '';
        if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
            currentContent = wp.data.select('core/editor').getEditedPostContent();
        } else if (typeof tinymce !== 'undefined' && tinymce.activeEditor && !tinymce.activeEditor.isHidden()) {
            currentContent = tinymce.activeEditor.getContent();
        } else {
            currentContent = document.getElementById('content').value;
        }

        optimizeBtn.innerHTML = '<span class="dashicons dashicons-update" style="animation: spin 2s linear infinite;"></span> Generating...';
        optimizeBtn.disabled = true;

        setTimeout(() => {
            simulatedContent = simulateRewrite(currentContent);

            // Format HTML safely for preview
            // Note: In production we would use DOMPurify. Since simulateRewrite strips all incoming
            // tags and reconstructs simple markup, innerHTML is reasonably safe for this local MVP simulation.
            modalContent.innerHTML = simulatedContent;

            modalOverlay.style.display = 'flex';

            optimizeBtn.innerHTML = '<span class="dashicons dashicons-admin-customizer"></span> Rewrite for AI Ranking';
            optimizeBtn.disabled = false;
        }, 800);
    });

    modalApply.addEventListener('click', () => {
        const newText = modalContent.innerHTML; // Get potentially manually edited HTML from modal

        if (typeof wp !== 'undefined' && wp.data && wp.dispatch('core/editor')) {
            // Gutenberg Apply
            const blocks = wp.blocks.parse(newText);
            wp.data.dispatch('core/editor').resetBlocks(blocks);
        } else if (typeof tinymce !== 'undefined' && tinymce.activeEditor && !tinymce.activeEditor.isHidden()) {
            // Classic Editor Apply
            tinymce.activeEditor.setContent(newText);
        } else {
            // Raw HTML textarea apply
            document.getElementById('content').value = newText;
        }

        closeModal();
    });


    let abortController = new AbortController();

    // --- Analysis Logic ---
    const MAX_CONTENT_LENGTH = 60000;

    const analyzeContent = (content) => {
        const cleanContent = content.trim();

        if (cleanContent === lastContent && cachedResult) {
            updateUI(cachedResult);
            return;
        }

        if (cleanContent.length > MAX_CONTENT_LENGTH) {
            // Prevent huge payloads from crashing the server/browser
            if (!cachedResult) {
                suggestionsList.innerHTML = '<li>Content is too long for real-time analysis. Max limit is 60,000 characters.</li>';
            }
            return;
        }

        lastContent = cleanContent;
        loadingIndicator.style.display = 'inline';

        // Abort any ongoing request
        abortController.abort();
        abortController = new AbortController();
        const signal = abortController.signal;

        fetch(geoData.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': geoData.nonce
            },
            body: JSON.stringify({
                content: cleanContent,
                post_id: parseInt(geoData.postId, 10)
            }),
            signal: signal
        })
        .then(response => response.json())
        .then(data => {
            if (data.code && data.message) {
                throw new Error(data.message);
            }
            cachedResult = data;
            updateUI(data);
        })
        .catch(err => {
            if (err.name === 'AbortError') {
                return; // Ignore aborted requests
            }
            if (cachedResult) {
                // Fallback to last known if timeout or API fails to prevent flicker
                updateUI(cachedResult);
            } else {
                suggestionsList.innerHTML = '<li>Analysis failed, try again.</li>';
            }
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });
    };

    const updateUI = (data) => {
        const score = data.score;

        // Update Score and Colors
        scoreValue.innerText = score;
        scoreValue.className = 'geo-score-number';
        scoreLabel.className = 'geo-score-label';

        if (score >= 80) {
            scoreValue.classList.add('score-green');
            scoreLabel.classList.add('score-green');
            scoreLabel.innerText = "AI Ready";
            visibilityLevel.innerText = "High";
            visibilityLevel.style.color = '#00a32a';
        } else if (score >= 50) {
            scoreValue.classList.add('score-yellow');
            scoreLabel.classList.add('score-yellow');
            scoreLabel.innerText = "Needs Optimization";
            visibilityLevel.innerText = "Medium";
            visibilityLevel.style.color = '#dba617';
        } else {
            scoreValue.classList.add('score-red');
            scoreLabel.classList.add('score-red');
            scoreLabel.innerText = "Low Visibility";
            visibilityLevel.innerText = "Low";
            visibilityLevel.style.color = '#d63638';
        }

        // Update Suggestions safely (Top 3)
        suggestionsList.innerHTML = '';
        if (data.suggestions && data.suggestions.length > 0) {
            const top3 = data.suggestions.slice(0, 3);
            top3.forEach(s => {
                const li = document.createElement('li');
                li.innerText = s;
                suggestionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'geo-perfect';
            li.innerText = "Content structure is optimized!";
            suggestionsList.appendChild(li);
        }

        // Show Pro Upsell if free
        const proUpsell = document.getElementById('geo-pro-upsell');
        if (data.hasOwnProperty('is_pro') && !data.is_pro) {
            proUpsell.style.display = 'block';
        } else {
            proUpsell.style.display = 'none';
        }

        // Update AI Answer Preview
        if (data.ai_answer) {
            aiPreview.innerText = data.ai_answer;
        } else {
            aiPreview.innerText = 'Not enough content to generate an AI answer preview.';
        }
    };

    const triggerDebouncedAnalysis = (content) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            analyzeContent(content);
        }, 2000); // Strict 2s debounce to prevent multiple calls
    };

    // --- Editor Hooks ---
    if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
        wp.data.subscribe(() => {
            const editor = wp.data.select('core/editor');
            if (editor.isSavingPost() || editor.isAutosavingPost()) return;
            triggerDebouncedAnalysis(editor.getEditedPostContent());
        });

        setTimeout(() => { triggerDebouncedAnalysis(wp.data.select('core/editor').getEditedPostContent()); }, 1000);
    } else {
        if (typeof tinymce !== 'undefined') {
            tinymce.on('AddEditor', function(e) {
                e.editor.on('change keyup', function() { triggerDebouncedAnalysis(e.editor.getContent()); });
            });
            setTimeout(() => {
                const activeEditor = tinymce.activeEditor;
                if (activeEditor && !activeEditor.isHidden()) triggerDebouncedAnalysis(activeEditor.getContent());
            }, 1000);
        }
        const contentTextArea = document.getElementById('content');
        if (contentTextArea) {
            contentTextArea.addEventListener('input', (e) => { triggerDebouncedAnalysis(e.target.value); });
            if (typeof tinymce === 'undefined' || (tinymce.activeEditor && tinymce.activeEditor.isHidden())) {
                setTimeout(() => { triggerDebouncedAnalysis(contentTextArea.value); }, 1000);
            }
        }
    }
});
