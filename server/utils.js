export function groupAndSum(arr, groupKeys, sumKeys, addKeys = []) {
  return Object.values(
    arr.reduce((acc, curr) => {

      const group = groupKeys.map(k => curr[k]).join('-');
      acc[group] = acc[group] || Object.fromEntries(
        groupKeys.map(k => [k, curr[k]]).concat(sumKeys.map(k => [k, 0])));
      sumKeys.forEach(k => acc[group][k] += curr[k]);

      //console.log(acc[group]);
      //console.log(curr);
      addKeys.forEach(a => {
        if (!Array.isArray(curr[a])) {
          //console.log(acc[group][a]);

          if (!acc[group][a]) { acc[group][a] = [] }
          acc[group][a].push(curr[a]);
        };
      
      });


  return acc;
}, { })
  );
}