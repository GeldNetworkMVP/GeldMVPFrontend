// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

contract ProductHistory {
  struct ProductData {
    bytes32 dataHash;
    uint256 productId;
    uint256 appId;
    bytes32 previousHash;
  }

  mapping(bytes32 => ProductData) public productHistory; // Map product hash to product data
  bytes32[] public dataHashes; // Array to store all data hashes

  event ProductAdded(bytes32 dataHash, uint256 productId, uint256 appId);

  function addProduct(
    bytes32 dataHash,
    uint256 productId,
    uint256 appId,
    bytes32 previousHash
  ) public {
    require(productHistory[dataHash].productId == 0, "Product already exists");
    productHistory[dataHash] = ProductData(dataHash, productId, appId, previousHash);
    dataHashes.push(dataHash); // Add data hash to the array
    emit ProductAdded(dataHash, productId, appId);
  }

  function getPreviousHash(bytes32 dataHash) public view returns (bytes32) {
    return productHistory[dataHash].previousHash;
  }

  // function verifyHash(uint256 productId, bytes32 inputHash) public view returns (bool) {
  //   bytes32 currentHash = dataHashByProductId(productId);
  //   require(currentHash != bytes32(0), "Product not found");
  //   while (currentHash != bytes32(0)) {
  //     if (currentHash == inputHash) {
  //       return true;
  //     }
  //     require(productHistory[currentHash].productId == productId, "Hash does not belong to the given product ID");
  //     currentHash = getPreviousHash(currentHash);
  //   }
  //   return false;
  // }

  // function dataHashByProductId(uint256 productId) public view returns (bytes32) {
  //    for (uint256 i = 0; i < dataHashes.length; i++) {
  //           bytes32 dataHash = dataHashes[i];
  //           if (productHistory[dataHash].productId == productId) {
  //               return dataHash;
  //           }
  //       }
  //   return bytes32(0); // Product not found
  // }

  function verifyHash(uint256 productId, bytes32 inputHash) public view returns (bool) {
    // Check if the input hash exists in the product history
    ProductData memory productData = productHistory[inputHash];
    if (productData.productId == productId) {
      return true; // The input hash belongs to the given product ID
    }
    return false; // The input hash does not belong to the given product ID
  }
}
