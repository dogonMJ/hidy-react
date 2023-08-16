export function mergeOptions (options, defaults) {
  if (options) options = JSON.parse(JSON.stringify(options));
  else options = {};
  defaults = defaults || {};
  for (var opt in defaults) {
    if (defaults.hasOwnProperty(opt) && !options.hasOwnProperty(opt)) {
      options[opt] = defaults[opt];
    }
  }
  return options;
}

export function toArray(x) {
  if (x.constructor !== Array) x = [x];
  return x;
}

export function prettyNumbers (numbers) {
  return numbers.map(prettyNumber)
}

function prettyNumber(number) {
  if (isNaN(number) || !isFinite(number)) return "";

  var absVal = Math.abs(number);
  var sign = number < 0 ? "-" : "";
  var scale;

  if (absVal < 1000) {
    scale = '';
  } else if (absVal < 1000000) {
    scale = 'K';
    absVal = absVal / 1000;

  } else if (absVal < 1000000000) {
    scale = 'M';
    absVal = absVal / 1000000;

  } else if (absVal < 1000000000000) {
    scale = 'B';
    absVal = absVal / 1000000000;

  } else if (absVal < 1000000000000000) {
    scale = 'T';
    absVal = absVal / 1000000000000;
  }

  if (absVal > 10) absVal = roundTo(absVal);
  else if (absVal > 1) absVal = roundTo(absVal, 10, true);
  else absVal = roundTo(absVal, 100, true);

  return sign + absVal + scale;
}
function roundTo(number, to, inverse) {
  to = to || 1;
  if (inverse) return Math.round(number * to) / to;
  else return Math.round(number / to) * to;
}

//D:\GitHub\hidy-react\node_modules\d3\src\scale\category.js
export const d3_category10 = [
  0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
  0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf
].map(value => '#' + value.toString(16));
// d3_category20+3
export const category23 = [
  0x1f77b4, 0xaec7e8, 0xff7f0e, 0xffbb78, 0x2ca02c, 0x98df8a, 0xd62728, 0xff9896, 0x9467bd, 0xc5b0d5,
  0x8c564b, 0xc49c94, 0xe377c2, 0xf7b6d2, 0x7f7f7f, 0xc7c7c7, 0xbcbd22, 0xdbdb8d, 0x17becf, 0x9edae5,
  0xffff33, 0xa65628, 0xf781bf
].map(value => '#' + value.toString(16));


//   module.exports.mergeOptions = mergeOptions;
//   module.exports.toArray = toArray;
//   module.exports.toFunction = toFunction;
//   module.exports.prettyNumbers = function (numbers) {
//     return numbers.map(prettyNumber);
//   }

//   function mergeOptions(options, defaults) {
//     if (options) options = JSON.parse(JSON.stringify(options));
//     else options = {};
//     defaults = defaults || {};
//     for (var opt in defaults) {
//       if (defaults.hasOwnProperty(opt) && !options.hasOwnProperty(opt)) {
//         options[opt] = defaults[opt];
//       }
//     }
//     return options;
//   }

//   function toArray(x) {
//     if (x.constructor !== Array) x = [x];
//     return x;
//   }

//   function toFunction(x) {
//     if (typeof x === "function") return (x);
//     x = toArray(x);
//     return function (d, i) { return x[i % x.length] };
//   }

//   function prettyNumber(number) {
//     if (isNaN(number) || !isFinite(number)) return "";

//     var absVal = Math.abs(number);
//     var sign = number < 0 ? "-" : "";
//     var scale;

//     if (absVal < 1000) {
//       scale = '';
//     } else if (absVal < 1000000) {
//       scale = 'K';
//       absVal = absVal / 1000;

//     } else if (absVal < 1000000000) {
//       scale = 'M';
//       absVal = absVal / 1000000;

//     } else if (absVal < 1000000000000) {
//       scale = 'B';
//       absVal = absVal / 1000000000;

//     } else if (absVal < 1000000000000000) {
//       scale = 'T';
//       absVal = absVal / 1000000000000;
//     }

//     if (absVal > 10) absVal = roundTo(absVal);
//     else if (absVal > 1) absVal = roundTo(absVal, 10, true);
//     else absVal = roundTo(absVal, 100, true);

//     return sign + absVal + scale;
//   }

//   function roundTo(number, to, inverse) {
//     to = to || 1;
//     if (inverse) return Math.round(number * to) / to;
//     else return Math.round(number / to) * to;
//   }
  
// }());
