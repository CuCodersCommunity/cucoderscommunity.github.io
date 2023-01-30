async function getRemoteFileData(url, type = "json") {
  var file;
  try {
    const response = await fetch(url, { method: "GET" });
    const data = type == "text" ? await response.text() : await response.json();
    file = data;
  } catch (e) {
    file = null;
  }
  return file;
}

export { getRemoteFileData };
