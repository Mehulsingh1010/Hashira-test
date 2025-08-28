# Hashira-test


# Catalog Placements Assignment - Polynomial Secret Solver

This project solves the assignment by reconstructing a polynomial from given roots in JSON format and finding the secret constant term **c**.

## How it works
1. Reads input from JSON test case files.
2. Decodes values from their given base to integers.
3. Uses **Lagrange interpolation** with `k` points to reconstruct the polynomial.
4. Evaluates the polynomial at `x = 0` to find the secret **c**.

## Requirements
- Node.js (v18+ recommended)

## PLease Run
```bash
node solver.js
