import networks from '../networks.json';

export function truncate(str, n) {
  return str.length > n
    ? str.substr(0, n - 1) + '...' + str.substr(str.length - 4, str.length - 1)
    : str;
}

export function getNetworkByChainId(chainId) {
  return networks?.find(network => network.chainId === Number(chainId));
}
