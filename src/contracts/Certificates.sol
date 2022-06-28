// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Certificates {

    struct Certificate {
        string student_name;
        string student_id;
        string issuer;
        string[] completed_modules;
        uint256 expiration_date;
    }

    mapping(bytes32 => Certificate) public certificates;

    event certificateGenerated(bytes32 _certificateId);

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
                result := mload(add(source, 32))
        }
    }

    function generateCertificate(
        string memory _id,
        string memory _student_name,
        string memory _student_id,
        string memory _issuer, 
        string[] memory _completed_modules, 
        uint256 _expiration_date) public {
        bytes32 byte_id = stringToBytes32(_id);
        
        certificates[byte_id] = Certificate(_student_name, _issuer, _student_id, _completed_modules, _expiration_date);
        emit certificateGenerated(byte_id);
    }

    function getData(string memory _id) public view returns(string memory, string memory, string memory, string[] memory, uint256) {
        bytes32 byte_id = stringToBytes32(_id);
        Certificate memory temp = certificates[byte_id];
        require(temp.expiration_date != 0, "No data exists");
        return (temp.student_name, temp.student_id, temp.issuer, temp.completed_modules, temp.expiration_date);
    }

}
