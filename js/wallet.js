/* Read-only EIP-1193 wallet helper. Methods used: eth_requestAccounts, eth_accounts, eth_chainId,
   wallet_addEthereumChain / wallet_switchEthereumChain, and (optional, user-ticked) personal_sign of a plain message.
   It NEVER calls eth_sendTransaction, eth_signTypedData, approve, permit or anything that moves funds. */
(function(){
const W={addr:null,chain:null,
  eth:()=>window.ethereum||null,
  short:a=>a?a.slice(0,6)+'…'+a.slice(-4):'',
  async connect(){const e=this.eth();if(!e)throw new Error('No browser wallet found. Install MetaMask or Rabby, then reload.');
    const acc=await e.request({method:'eth_requestAccounts'});this.addr=acc[0]||null;this.chain=await e.request({method:'eth_chainId'});this.emit();return this.addr},
  async restore(){const e=this.eth();if(!e)return;try{const acc=await e.request({method:'eth_accounts'});this.addr=acc[0]||null;this.chain=await e.request({method:'eth_chainId'});this.emit()}catch(_){}
    e.on&&e.on('accountsChanged',a=>{this.addr=a[0]||null;this.emit()});e.on&&e.on('chainChanged',c=>{this.chain=c;this.emit()})},
  async addChain(){const e=this.eth();if(!e)throw new Error('No browser wallet found.');const C=CFG.CHAIN;
    try{await e.request({method:'wallet_switchEthereumChain',params:[{chainId:C.chainId}]})}
    catch(err){if(err&&(err.code===4902||/unrecognized|not added/i.test(err.message||'')))await e.request({method:'wallet_addEthereumChain',params:[C]});else throw err}
    this.chain=await e.request({method:'eth_chainId'});this.emit()},
  async signMessage(text){if(!this.addr)await this.connect();const hex='0x'+[...new TextEncoder().encode(text)].map(b=>b.toString(16).padStart(2,'0')).join('');
    return this.eth().request({method:'personal_sign',params:[hex,this.addr]})},
  onRH(){return this.chain&&parseInt(this.chain,16)===parseInt(CFG.CHAIN.chainId,16)},
  emit(){document.dispatchEvent(new CustomEvent('wallet',{detail:this}))}};
window.Wallet=W;
})();
