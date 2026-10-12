# Barkipelago 🐾

A hand-drawn corgi platformer + game site. Starring **Corgi**. 100% static and client-side: no paid APIs, no build step, no trackers.

**Play:** https://0xrenny.github.io/barkipelago/

## What's inside
- **Islands** – animated SVG world map. Each island is a level; hover to see its quests, click to play. Islands unlock in order.
- **Play** – Canvas 2D platformer (960×544, 60 fps): run, variable jump, coyote time, jump buffering, enemies you can bonk, bones, checkpoints, springs, moving platforms, lava, a hidden kennel key per level, pause, restart, SFX.
- **Quests** – 3 quests per island (bones, secret key, a time / bonk / no-damage challenge). Progress lives in `localStorage` (`barki.save.v1`).
- **Summon** – demo-only pup generator (seeded traits, Common → Legendary). Not an NFT, no minting, no payments.
- **Waitlist** – email + optional X handle, saved locally. Optional free backend via `WAITLIST_ENDPOINT`.
- **Connect** – X placeholder (no integration yet) + read-only wallet.

## Controls
← → / A D run · Space / W / ↑ / Z jump (hold for higher) · P / Esc pause · R restart · touch buttons on phones.

## Rename the game
Edit `js/config.js` → `NAME`, `TAGLINE`. Everything reads from there.

## Music & art
All music is original and generated live with WebAudio (`js/music.js`: Am7–Fmaj7–Cmaj7–G7 lo-fi loop, pentatonic plucks, soft reverb). It only starts after a click/keypress; the ♪ toggle is remembered. All art is drawn in code (Canvas/SVG). No third-party assets → no licenses to track. Fonts: Fredoka & Inter from Google Fonts (SIL Open Font License).

## Wallet (read-only)
Uses the injected EIP-1193 provider (`window.ethereum`: MetaMask, Rabby…). Calls only `eth_requestAccounts`, `eth_accounts`, `eth_chainId`, `wallet_switchEthereumChain` / `wallet_addEthereumChain` (Robinhood Chain, chainId 4663, public RPC `https://rpc.mainnet.chain.robinhood.com`) and — only if the user ticks the box — `personal_sign` of a plain-text message. It never sends transactions, approvals, permits or typed-data signatures.

## Free waitlist backend options
Set `CFG.WAITLIST_ENDPOINT` to any URL that accepts a JSON POST:
- **Google Apps Script** web app writing to a Google Sheet (free).
- **Formspree** free tier (50 submissions/month).
- **Supabase** free tier (REST insert into a table with an anon key + RLS insert-only policy).
- **Cloudflare Worker + KV** free tier.
Until then entries stay in the visitor's browser (`barki.waitlist`).
