# AI Generator

This feature allows you to generate titles and descriptions for your content using AI.

We add a `Use AI` button to the current previews, via the replacement variable editor. The button ends up next to the
`Insert variable` button.

This button is not added on:

- Attachments
- Any fields that are not known previews (e.g. search, social and X)

## Flow to the AI generator in the editor

```mermaid
flowchart LR
  UseAI[User tries to use a Yoast AI Generate feature]
  ShowConsent[Show the AI consent modal]
  ShowUpsellWithTry[Show the AI upsell modal with a “Try for free” button]
  ShowUpsellNoSparks[Show the AI upsell modal with no free sparks left alert]
  ShowUpsellToast[Show the AI upsell toast/notification about no free sparks left]
  ShowAI[Show the AI generator modal]
  IsFreeSparks{Did the site start “Try for free” yet?}
  ClickedFreeSparks{Did the user click on “Try for free”?}
  HasConsent{Did the user grant Yoast AI consent?}
  GaveConsent{Did the user give consent?}
  HasSparksLeft{Does the site have sparks left?}
  LastSpark{Was this your last spark?}
  SaveFreeSparks{{Save the timestamp as a wpseo option: ai_free_sparks_started_on}}
  PreventAI{{Prevent the user from generating more. But instead ensure the toast above is visible / show again if dismissed}}
  End((End flow))
  UseAI --> IsFreeSparks
  IsFreeSparks -->|Yes| HasConsent
  IsFreeSparks -->|No| ShowUpsellWithTry --> ClickedFreeSparks
  HasConsent -->|Yes| HasSparksLeft
  HasConsent -->|No| ShowConsent --> GaveConsent
  GaveConsent -->|Yes| HasSparksLeft
  GaveConsent -->|No| End
  HasSparksLeft -->|Yes| ShowAI --> LastSpark
  HasSparksLeft -->|No| ShowUpsellNoSparks --> End
  ClickedFreeSparks -->|Yes| SaveFreeSparks --> HasConsent
  ClickedFreeSparks -->|No| End
  LastSpark -->|Yes| ShowUpsellToast --> PreventAI --> End
  LastSpark -->|No| End
```
