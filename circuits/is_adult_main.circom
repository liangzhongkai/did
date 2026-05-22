pragma circom 2.0.0;

include "./IsAdult.circom";

component main {public [currentYear]} = IsAdult();
