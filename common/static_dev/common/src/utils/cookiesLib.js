export default {
  getCookie(cname) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cname) {
        return decodeURIComponent(value);
      }
    }
    return null;
  },
  getOrSetCookie(cname, def = null) {
    const value = this.getCookie(cname);
    if(value) {
      return value;
    }
    this.setCookie(cname, def);
    return def;
  },
  setCookie(cname, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  deleteCookie(cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};
