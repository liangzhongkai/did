pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

// Proves the holder was born on or before (currentYear - 18) without revealing birthdate.
// birthdate: private YYYYMMDD integer (e.g. 20000115)
// currentYear: public reference year (e.g. 2026)
// is_adult: public output, 1 if age >= 18 else 0
template IsAdult() {
    signal input birthdate;
    signal input currentYear;
    signal output is_adult;

    signal birthYear;
    signal remainder;

    birthYear <-- birthdate \ 10000;
    remainder <-- birthdate % 10000;
    birthdate === birthYear * 10000 + remainder;

    component remainderCheck = LessThan(14);
    remainderCheck.in[0] <== remainder;
    remainderCheck.in[1] <== 10000;
    remainderCheck.out === 1;

    signal age;
    age <== currentYear - birthYear;

    component ageCheck = GreaterEqThan(16);
    ageCheck.in[0] <== age;
    ageCheck.in[1] <== 18;
    is_adult <== ageCheck.out;
}
