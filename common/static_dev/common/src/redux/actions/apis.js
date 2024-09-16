import {getRequest, getUrl, patchRequest } from "../network.js";
import GeneratedActions from './actions.gen.js';

export default {
  async getUser() {
    const url = getUrl("user/me");
    return await getRequest(url);
  },
  async updateUser({uid, formData}) {
    const url = getUrl(`user/${uid}`);
    return await patchRequest(url, formData);
  },
  async getCartSummary() {
    const url = getUrl("cart/summary");
    return await getRequest(url);
  },

  ...GeneratedActions,
};
