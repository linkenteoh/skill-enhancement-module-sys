const Web3 = require("web3");
const contract = require("truffle-contract");
const HDWalletProvider = require("truffle-hdwallet-provider");

const certification_artifact = require("../../src/abis/Certificates.json");

const CertificateInstance = contract(certification_artifact);

const connectWeb3 = function() {
    const self = this;
//   if (process.env.NODE_ENV === "development") {
//     self.web3 = new Web3(
//       new Web3.providers.HttpProvider(process.env.LOCAL_ENDPOINT)
//     );
//   } else {
//     self.web3 = new Web3(
//       new HDWalletProvider(process.env.MNEMONIC, process.env.PROJECT_ENDPOINT)
//     );
//   }
    self.web3 = new Web3(
        new HDWalletProvider("00f8e7eda184193f1b9ff9ca95656d23b2a9a266357e47f753b1b7b5fe6f6aa4", "https://ropsten.infura.io/v3/360e6688166f47e5bf0edb6e2ace5d32")
    );

    CertificateInstance.setProvider(self.web3.currentProvider);
    
    if (typeof CertificateInstance.currentProvider.sendAsync !== "function") {
        CertificateInstance.currentProvider.sendAsync = function() {
            return CertificateInstance.currentProvider.send.apply(
                CertificateInstance.currentProvider,
                arguments
            );
        };
    }
};

const getAccounts = function() {
  const self = this;

  return self.web3.eth.getAccounts();
};

const getCertificateData = function(certificateId) {
  const self = this;

  CertificateInstance.setProvider(self.web3.currentProvider);

  return CertificateInstance.deployed()
    .then(ins => ins.getData(certificateId))
    .catch(err => Promise.reject("No certificate found with the input id"));
};

const generateCertificate = function(
  id,
  candidateName,
  studId,
  orgName,
  courseName,
  expirationDate
) {
  const self = this;

  CertificateInstance.setProvider(self.web3.currentProvider);

  return self.getAccounts().then(answer => {
    let accountAddress = answer[0];
    return CertificateInstance.deployed()
      .then(instance =>
        instance.generateCertificate(
          id,
          candidateName,
          studId,
          orgName,
          courseName,
          expirationDate,
          { from: accountAddress.toLowerCase(), gas: 2000000 }
        )
      )
      .catch(err => {
        return Promise.reject(err.toString());
      });
  });
};

module.exports = {
  connectWeb3,
  getAccounts,
  getCertificateData,
  generateCertificate
};