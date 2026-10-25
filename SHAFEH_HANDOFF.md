# Selected-reading handoff

The reading view offers “Ask about this reading” in a separate tab. The link is built at selection/navigation time from this app's own `getSeferFromParasha(currParsha)` and `aliyos[currParsha][currAliya]` values. Single, doubled and maftir ranges use the same contract:

`https://shafeh.org/chumash/reading/:book/:start_chapter/:start_verse/:end_chapter/:end_verse`

The range is inclusive. Shafeh validates both boundaries against its bundled Torah text, displays that exact range with Onkelos, and supplies it to the on-page Ask context. The link sends no user identifiers, questions, selected text or arbitrary external destination. The app's book/range data determines the destination; a promotional page or today's calendar is not a substitute for the selection.

Requires the Rails reader route in sharshi/rails-app before deployment here. This change does not embed Shafeh, share login credentials, or automatically ask a model a question. Native Cordova external-browser behavior still needs device acceptance.

Validation: `node test/shafeh-reading.test.cjs` and `node --check js/shafeh-reading.js`. On 2026-10-25, all 487 existing app ranges were also resolved successfully against the Rails bundled corpus. Real browser/device acceptance and deployment of this separate app remain outstanding.
