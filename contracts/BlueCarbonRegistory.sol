// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarbonMonitoringRegistry {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Not owner"
        );
        _;
    }

    struct MonitoringRecord {

        uint256 monitoringId;

        uint256 historyId;

        string siteName;

        uint256 year;

        uint256 tokensIssued;

        uint256 annualCO2;

        bytes32 metadataHash;

        uint256 timestamp;
    }

    mapping(uint256 => MonitoringRecord)
        public records;

    event MonitoringStored(

        uint256 monitoringId,

        uint256 historyId,

        string siteName,

        uint256 year,

        uint256 tokensIssued,

        bytes32 metadataHash,

        uint256 timestamp
    );

    function storeMonitoringRecord(

        uint256 monitoringId,

        uint256 historyId,

        string memory siteName,

        uint256 year,

        uint256 tokensIssued,

        uint256 annualCO2,

        bytes32 metadataHash

    )
        public
        onlyOwner
    {

        records[monitoringId] =
            MonitoringRecord({

                monitoringId:
                    monitoringId,

                historyId:
                    historyId,

                siteName:
                    siteName,

                year:
                    year,

                tokensIssued:
                    tokensIssued,

                annualCO2:
                    annualCO2,

                metadataHash:
                    metadataHash,

                timestamp:
                    block.timestamp
            });

        emit MonitoringStored(

            monitoringId,

            historyId,

            siteName,

            year,

            tokensIssued,

            metadataHash,

            block.timestamp
        );
    }

    function getMonitoringRecord(
        uint256 monitoringId
    )
        public
        view
        returns (
            MonitoringRecord memory
        )
    {
        return records[monitoringId];
    }
}