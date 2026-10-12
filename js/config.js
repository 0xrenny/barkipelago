/* Change the game name / copy here — every label on the site reads from this object. */
window.CFG = {
  NAME: "Barkipelago",
  TAGLINE: "A tiny corgi. Four floating islands. Zero chill.",
  HERO_NAME: "Corgi",
  X_HANDLE: "",                 // e.g. "barkipelago" once the X account exists
  WAITLIST_ENDPOINT: "",        // optional free backend URL (Formspree / Google Apps Script / Supabase). Empty = saved on this device only.
  SUMMON_SUPPLY: 3333
};
/* Robinhood Chain (public RPC, verified eth_chainId = 0x1237 / 4663). Used read-only by the wallet button. */
window.CFG.CHAIN = {
  chainId: "0x1237", chainName: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
  blockExplorerUrls: ["https://robinhoodchain.blockscout.com"]
};
