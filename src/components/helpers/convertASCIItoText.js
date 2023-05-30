function convertASCIINamesToText(str) {
  // convert HTML Names such as "&amp;" for "&"
  /* every HTMLName replacement needs to be a 
  separate statement, because string.replace() 
  can only replace one value at a time.*/
  let replaceAmp = str.replaceAll("&quot;", '"');
  let replaceQuot = replaceAmp.replaceAll("&amp;", "&");
  let convertedHTMLNames = replaceQuot;
  return convertedHTMLNames
}

function convertASCIINumbersToText(str) {
  // convert HTML Numbers such as "&#36;" for $
  return str.replace(/&#(\d+);/g, (match, code) => {
    let convertedHTMLNumbers = String.fromCharCode(Number(code));
    return convertedHTMLNumbers
  });
}

function convertASCIICharsToText(str) {
  let conversion1 = convertASCIINamesToText(str);
  let conversion2 = convertASCIINumbersToText(conversion1);
  let processedString = conversion2;
  return processedString
}

export { convertASCIICharsToText }