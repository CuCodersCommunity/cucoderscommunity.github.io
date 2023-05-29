function convertASCIItoText(str) {
  // regex for ASCII HTML Number codes
    return str.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(Number(code));
    });
}

export { convertASCIItoText }