pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

// Proves balance > threshold without revealing balance.
// balance: private
// threshold: public
// above: public output, 1 if balance > threshold else 0
template IsBalanceAbove() {
    signal input balance;
    signal input threshold;
    signal output above;

    component gt = GreaterThan(64);
    gt.in[0] <== balance;
    gt.in[1] <== threshold;
    above <== gt.out;
}
