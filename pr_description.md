# 🔒 Fix Client-Side Denial of Service (DoS) in Sticker Range Parsing

## 🎯 What
The `parseAlbumCode` method in `js/parser.js` contained a Client-Side Denial of Service (DoS) vulnerability. When parsing owned items containing a range string (e.g., `start-end`), the code extracted `start` and `end`, calculated `min` and `max`, and iterated from `min` to `max` checking if `i >= 1 && i <= this.TOTAL_STICKERS`. A maliciously crafted string (such as `1-999999999`) could cause the client browser or Node.js process to hang entirely by looping hundreds of millions of times before doing the internal bound check.

## ⚠️ Risk
An attacker could craft a malicious shareable code with huge ranges. If a user tries to parse this code or click a link with this code, their browser tab or Node process would freeze or crash, leading to a complete disruption of service (Client-side DoS).

## 🛡️ Solution
The fix introduces simple, constant-time validation before iterating over the range. The `min` and `max` values are safely clamped using `Math.max(1, min)` and `Math.min(this.TOTAL_STICKERS, max)` so the loop will never exceed the allowed number of iterations regardless of what the user supplies.
A test was also added in `js/test_parser.js` that confirms execution stays under 100ms for massive ranges, effectively eliminating the vulnerability.
