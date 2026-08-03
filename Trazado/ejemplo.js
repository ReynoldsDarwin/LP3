let sum = 0;
for (let i = 10; i >= 6; i--) {
    if (i === 8) {
        continue; 
    }
    sum += i;
}
console.log(sum);