# TradeShield

TradeShield is a browser-extension interface that helps users assess trading websites before they deposit funds, connect an exchange account, or share sensitive information. It highlights common indicators of broker impersonation, fraudulent investment offers, copy-trading scams, and API-key theft attempts.

> TradeShield provides risk indicators, not financial, legal, or regulatory advice. Always verify a broker directly through the relevant regulator before sending money or granting account access.

## Protection Focus

| Area | What TradeShield checks |
| --- | --- |
| Website analysis | High-pressure investment language, guaranteed-return claims, deposit incentives, and fee demands |
| API-key protection | Requests for API keys, withdrawal permissions, and other sensitive exchange access |
| Broker verification | Claimed license details, jurisdiction signals, and potential identity mismatches |
| Domain intelligence | Domain naming patterns commonly associated with suspicious trading websites |

## Core Capabilities

- Scores the active page against a set of high-risk phrases and stores the latest signal locally.
- Provides a popup summary with an estimated risk level for the current tab.
- Includes a dashboard for manual domain scans, alert review, and broker lookup.
- Supports onboarding guidance for identifying unsafe API permissions and common trading-scam tactics.
- Keeps extension state in browser-local storage.

## Risk Signals

The current detection model uses transparent, rule-based signals. Examples include phrases such as `guaranteed returns`, `risk-free`, `copy trading`, `deposit bonus`, `tax clearance fee`, and requests for API keys or withdrawal permission.

Scores are capped at 96 and grouped into three levels:

| Score | Level | Suggested response |
| --- | --- | --- |
| 0-45 | Low | Continue cautiously and independently verify the broker. |
| 46-75 | Medium | Check the license, company identity, and domain ownership before proceeding. |
| 76-96 | High | Do not deposit funds or grant API permissions until the platform has been independently verified. |

## Project Structure

```text
TradeShield/
|-- dashboard/       Dashboard views for scans, alerts, brokers, and settings
|-- onboarding/      Guided introduction and permission education
|-- js/              Extension logic, page analysis, and interface behavior
|-- css/             Shared application styles and animations
|-- data/            Rule and broker demonstration datasets
|-- Assets/          Extension icons and visual assets
|-- manifest.json    Chrome Extension Manifest V3 configuration
`-- popup.html       Browser-action popup
```

## Privacy and Scope

TradeShield is designed to keep the latest protection signal in local extension storage. Its current scanner is a heuristic demonstration: it does not confirm that a broker is licensed, determine whether a website is legitimate, or replace direct checks with regulators and exchanges.

## Browser Permissions

| Permission | Purpose |
| --- | --- |
| `activeTab` | Access the currently active tab when the extension is used. |
| `storage` | Retain local protection state and the latest signal. |
| `scripting` | Support extension-side page analysis behavior. |
| Host access | Analyze pages covered by the extension's content script. |
