import {getRequest, getUrl, patchRequest, postRequest } from "../network.js";
import GeneratedActions from './actions.gen.js';

export default {
  async getUser() {
    const url = getUrl("user/me");
    return await getRequest(url);
  },
  async getChoices() {
    const url = getUrl("user/choices");
    return await getRequest(url);
  },
  async loginUser(formData) {
    const url = getUrl("login");
    return await postRequest(url, formData);
  },
  async updateUser({uid, formData}) {
    const url = getUrl(`user/${uid}`);
    return await patchRequest(url, formData);
  },
  async createUser(formData) {
    const url = getUrl(`user`);
    return await postRequest(url, formData);
  },
  async getCartSummary() {
    const url = getUrl("cart/summary");
    return await getRequest(url);
  },
  async placeOrder(formData) {
    const url = getUrl("cart/place");
    return await postRequest(url, formData);
  },
  async logoutUser() {
    const url = "logout/";
    return await getRequest(url);
  },

  ...GeneratedActions,
};
