# Circuit Specification

## IsAdult

| Signal | Visibility | Type | Description |
|--------|-----------|------|-------------|
| `birthdate` | private | field | YYYYMMDD integer |
| `currentYear` | public | field | Reference year |
| `is_adult` | public output | field | 1 if age >= 18, else 0 |

**Constraints:** 32 non-linear, 9 linear  
**Public inputs:** 1 (`currentYear`)  
**Public outputs:** 1 (`is_adult`)

## IsBalanceAbove

| Signal | Visibility | Type | Description |
|--------|-----------|------|-------------|
| `balance` | private | field | Asset balance |
| `threshold` | public | field | Comparison threshold |
| `above` | public output | field | 1 if balance > threshold, else 0 |

**Constraints:** 65 non-linear, 3 linear  
**Public inputs:** 1 (`threshold`)  
**Public outputs:** 1 (`above`)
