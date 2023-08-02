function isUserLogged() {
  return "user_username" in localStorage;
}

function loggoutUser() {
  if (!isUserLogged()) return;

  localStorage.removeItem("user_username");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_url");
  localStorage.removeItem("user_avatar_url");
}

async function loggingUser(username) {
  const response = await fetch("https://api.github.com/users/" + username);
  const userdata = await response.json();
  if (userdata) {
    localStorage.setItem("user_username", userdata.login);
    localStorage.setItem("user_name", userdata.name);
    localStorage.setItem("user_url", "https://cucoders.dev/dev/" + username);
    localStorage.setItem("user_avatar_url", `https://avatars.githubusercontent.com/u/${userdata.id}?s=48&v=`);
  }
  return userdata;
}

export { isUserLogged, loggoutUser, loggingUser };
