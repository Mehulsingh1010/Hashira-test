//we will import basic filesystem modules...
const fs = require("fs");

//we will be decoding string in any base → BigInt
function decodeR(v, b) {
  b = BigInt(b);
  return [...v.toLowerCase()].reduce((n, ch) => {
    let d = ch >= "0" && ch <= "9" ? BigInt(ch) : BigInt(ch.charCodeAt(0) - 87);
    return n * b + d;
  }, 0n);
}

// gcdFinder for BigInt
function gcdFinder(a, b) {
  a = a < 0n ? -a : a;
  while (b) [a, b] = [b, a % b];
  return a;
}

// exact fraction with BigInt, since lagrange uses fractions some what like (x-xj)/(xi-xj),
//  normal JS numbers can loose precision so we use BigInt, we also reduce gcdFinder so that numbers don't grow too big and its easy to check equality
class F {
  constructor(n, d = 1n) {
    if (d < 0n) (n = -n, d = -d);
    const g = gcdFinder(n, d);
    this.n = n / g; this.d = d / g;
  }
  add(o) { return new F(this.n * o.d + o.n * this.d, this.d * o.d); }
  mul(o) { return new F(this.n * o.n, this.d * o.d); }
}

// here is the catch, lagrange interpolation at x=0 → constant c
function lagrange(points) {
  let sum = new F(0n);
  for (let i = 0; i < points.length; i++) {
    let t = new F(points[i].y);
    for (let j = 0; j < points.length; j++) if (i !== j)
      t = t.mul(new F(-BigInt(points[j].x), BigInt(points[i].x - points[j].x)));
    sum = sum.add(t);
  }
  return sum.n / sum.d; // this would 100 percent give us guranteed integer
}

//finalData for parsing and using fs to read files
//then we use a const pts to store the points after decoding them
//finally we call lagrange on first k points to get the printSecret
function solution(file) {
  const finalData = JSON.parse(fs.readFileSync(file, "utf8"));
  const pts = Object.keys(finalData).filter(k => k !== "keys").map(k => ({
    x: +k,
    y: decodeR(finalData[k].value, finalData[k].base)
  }));
  const printSecret = lagrange(pts.slice(0, finalData.keys.k));
  console.log(`${file}: c = ${printSecret}`);
}
//name of my json files, more testcases then simply add comma and write names of json files
["case1.json", "case2.json"].forEach(solution);
