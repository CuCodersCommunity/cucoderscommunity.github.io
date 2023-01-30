async function getRemoteFileData(url, type = "json") {
  var file;
  try {
    const response = await fetch(url, { method: "GET" });
    if (response.status == 200) {
      const data = type == "text" ? await response.text() : await response.json();
      file = data;
    } else {
      file = null;
    }
  } catch (e) {
    file = null;
  }
  return file;
}

export { getRemoteFileData };
