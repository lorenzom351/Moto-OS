declare module "virtual:sites-connector-preview" {
  const binding: import("./connector-contract.mjs").ConnectorBinding;
  export default binding;
}

// Apenas a pré-visualização local usa um vínculo de ambiente. Sites hospedados recebem a
// capacidade vinculada à requisição por ctx.props.CONNECTORS em sites-worker.ts.
declare namespace Cloudflare {
  interface Env {
    CONNECTORS?: import("./connector-contract.mjs").ConnectorBinding;
  }
}
