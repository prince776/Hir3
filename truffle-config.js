require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { API_URL, MNEMONIC } = process.env;

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },
        mumbaiTestNet: {
            provider: function() {
              return new HDWalletProvider(MNEMONIC, API_URL)
            },
            network_id: 80001,
            gas: 4000000 //4M is the max
        }
    },
    contracts_build_directory: './src/abis/',
    compilers: {
        solc: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            version: '0.8.0',
        },
    },
}
