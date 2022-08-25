// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Voting_nonoptimized {
    event ProposalSubmitted(uint256 indexed proposalId);
    event VoteSubmitted(
        uint8 indexed proposalId,
        address indexed voter,
        Vote vote
    );
    bytes32 public proposers;

    // address[] public proposers;
    // address[] public voters;
    mapping(address => uint8[]) public voters;

    struct Proposal {
        uint64 deadline;
        uint64 votesFor;
        uint64 votesAgainst;
        // address[] voters;
    }

    enum ProposalStatus {
        NON_EXISTENT,
        IN_PROGRESS,
        DONE__FOR,
        DONE__AGAINST,
        DONE__TIE
    }

    enum Vote {
        NONE,
        FOR,
        AGAINST
    }

    Proposal[] public proposals;

    modifier onlyProposer(bytes32[] calldata _proof) {
        bool isProposer = MerkleProof.verify(
            _proof,
            proposers,
            keccak256(abi.encodePacked(msg.sender))
        );
        require(isProposer, "NOT_PROPOSER");
        // bool proposerFound = false;
        // for (uint8 i = 0; i < proposers.length; i++) {
        //     if (proposers[i] == msg.sender) {
        //         proposerFound = true;
        //         break;
        //     }
        // }
        // require(proposerFound == true, "NOT_PROPOSER");
        _;
    }

    modifier onlyVoter() {
        // bool voterFound = false;

        require(voters[msg.sender].length > 0, "NOT_VOTER");

        // for (uint8 i = 0; i < voters.length; i++) {
        //     if (voters[i] == msg.sender) {
        //         voterFound = true;
        //         break;
        //     }
        // }
        // require(voterFound == true, "NOT_VOTER");
        _;
    }

    constructor(bytes32 _proposers, address[] memory _voters) {
        proposers = _proposers;
        for (uint256 i = 0; i < _voters.length; i++) {
            voters[_voters[i]] = [111];
        }
    }

    function submitProposal(uint64 _deadline, bytes32[] calldata _proof)
        external
        onlyProposer(_proof)
    {
        // address[] memory emptyVoters;
        proposals.push(Proposal(_deadline, 0, 0));

        emit ProposalSubmitted(proposals.length - 1);
    }

    function vote(uint8 _proposalId, Vote _vote) external onlyVoter {
        require(_vote != Vote.NONE, "CANNOT_VOTE_NONE");
        require(
            proposals[_proposalId].deadline > block.timestamp,
            "PROPOSAL_AFTER_DEADLINE"
        );
        require(_hasVoted(_proposalId, msg.sender) == false, "ALREADY_VOTED");

        if (_vote == Vote.FOR) {
            proposals[_proposalId].votesFor++;
        } else if (_vote == Vote.AGAINST) {
            proposals[_proposalId].votesAgainst++;
        }
        // proposals[_proposalId].voters.push(msg.sender);

        // uint256[] memory votersVotes = voters[msg.sender];
        // votersVotes.push(_proposalId);
        voters[msg.sender].push(_proposalId);

        emit VoteSubmitted(_proposalId, msg.sender, _vote);
    }

    function _hasVoted(uint256 _proposalId, address voter)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < voters[voter].length; i++) {
            if (voters[voter][i] == _proposalId) {
                return true;
            }
        }
        // for (uint256 i = 0; i < proposals[_proposalId].voters.length; i++) {
        //     if (proposals[_proposalId].voters[i] == voter) {
        //         return true;
        //     }
        // }

        return false;
    }

    function getProposalDetails(uint256 _proposalId)
        external
        view
        returns (
            ProposalStatus status,
            uint256 votesFor,
            uint256 votesAgainst
        )
    {
        Proposal memory proposal = proposals[_proposalId];

        if (proposal.deadline <= block.timestamp) {
            status = ProposalStatus.IN_PROGRESS;
        } else {
            // votesAgainst = proposal.voters.length - proposal.votesFor;
            if (proposal.votesFor > proposal.votesAgainst) {
                status = ProposalStatus.DONE__FOR;
            } else if (proposal.votesFor < proposal.votesAgainst) {
                status = ProposalStatus.DONE__AGAINST;
            } else {
                status = ProposalStatus.DONE__TIE;
            }
        }

        return (status, proposal.votesFor, votesAgainst);
    }
}
