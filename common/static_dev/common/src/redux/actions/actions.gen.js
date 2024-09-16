
import {
  getRequest,
  getUrl,
  postRequest,
  patchRequest,
  deleteRequest
} from "../network";

export default {

  async listAddress(query) {
    const url = getUrl("address");
    return await getRequest(url, query);
  },

  async getAddress(uid) {
    const url = getUrl(`address/${uid}`);
    return await getRequest(url);
  },

  async createAddress(formData) {
    const url = getUrl("address");
    return await postRequest(url, formData);
  },

  async updateAddress({uid, formData}) {
    const url = getUrl(`address/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateAddress({uid, formData}) {
    return await uid?this.updateAddress({uid, formData}):this.createAddress(formData);
  },

  async deleteAddress(uid) {
    const url = getUrl(`address/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteAddress({uid, formData}) {
    return await uid?this.deleteAddress(uid):this.createAddress(formData);
  },


  async listCard(query) {
    const url = getUrl("card");
    return await getRequest(url, query);
  },

  async getCard(uid) {
    const url = getUrl(`card/${uid}`);
    return await getRequest(url);
  },

  async createCard(formData) {
    const url = getUrl("card");
    return await postRequest(url, formData);
  },

  async updateCard({uid, formData}) {
    const url = getUrl(`card/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateCard({uid, formData}) {
    return await uid?this.updateCard({uid, formData}):this.createCard(formData);
  },

  async deleteCard(uid) {
    const url = getUrl(`card/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteCard({uid, formData}) {
    return await uid?this.deleteCard(uid):this.createCard(formData);
  },


  async listCart(query) {
    const url = getUrl("cart");
    return await getRequest(url, query);
  },

  async getCart(uid) {
    const url = getUrl(`cart/${uid}`);
    return await getRequest(url);
  },

  async createCart(formData) {
    const url = getUrl("cart");
    return await postRequest(url, formData);
  },

  async updateCart({uid, formData}) {
    const url = getUrl(`cart/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateCart({uid, formData}) {
    return await uid?this.updateCart({uid, formData}):this.createCart(formData);
  },

  async deleteCart(uid) {
    const url = getUrl(`cart/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteCart({uid, formData}) {
    return await uid?this.deleteCart(uid):this.createCart(formData);
  },


  async listDesign(query) {
    const url = getUrl("design");
    return await getRequest(url, query);
  },

  async getDesign(uid) {
    const url = getUrl(`design/${uid}`);
    return await getRequest(url);
  },

  async createDesign(formData) {
    const url = getUrl("design");
    return await postRequest(url, formData);
  },

  async updateDesign({uid, formData}) {
    const url = getUrl(`design/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateDesign({uid, formData}) {
    return await uid?this.updateDesign({uid, formData}):this.createDesign(formData);
  },

  async deleteDesign(uid) {
    const url = getUrl(`design/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteDesign({uid, formData}) {
    return await uid?this.deleteDesign(uid):this.createDesign(formData);
  },


  async listOrder(query) {
    const url = getUrl("order");
    return await getRequest(url, query);
  },

  async getOrder(uid) {
    const url = getUrl(`order/${uid}`);
    return await getRequest(url);
  },

  async createOrder(formData) {
    const url = getUrl("order");
    return await postRequest(url, formData);
  },

  async updateOrder({uid, formData}) {
    const url = getUrl(`order/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateOrder({uid, formData}) {
    return await uid?this.updateOrder({uid, formData}):this.createOrder(formData);
  },

  async deleteOrder(uid) {
    const url = getUrl(`order/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteOrder({uid, formData}) {
    return await uid?this.deleteOrder(uid):this.createOrder(formData);
  },


  async listUserProfile(query) {
    const url = getUrl("user-profile");
    return await getRequest(url, query);
  },

  async getUserProfile(uid) {
    const url = getUrl(`user-profile/${uid}`);
    return await getRequest(url);
  },

  async createUserProfile(formData) {
    const url = getUrl("user-profile");
    return await postRequest(url, formData);
  },

  async updateUserProfile({uid, formData}) {
    const url = getUrl(`user-profile/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateUserProfile({uid, formData}) {
    return await uid?this.updateUserProfile({uid, formData}):this.createUserProfile(formData);
  },

  async deleteUserProfile(uid) {
    const url = getUrl(`user-profile/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteUserProfile({uid, formData}) {
    return await uid?this.deleteUserProfile(uid):this.createUserProfile(formData);
  },


  async listWishlist(query) {
    const url = getUrl("wishlist");
    return await getRequest(url, query);
  },

  async getWishlist(uid) {
    const url = getUrl(`wishlist/${uid}`);
    return await getRequest(url);
  },

  async createWishlist(formData) {
    const url = getUrl("wishlist");
    return await postRequest(url, formData);
  },

  async updateWishlist({uid, formData}) {
    const url = getUrl(`wishlist/${uid}`);
    return await patchRequest(url, formData);
  },

  async createOrUpdateWishlist({uid, formData}) {
    return await uid?this.updateWishlist({uid, formData}):this.createWishlist(formData);
  },

  async deleteWishlist(uid) {
    const url = getUrl(`wishlist/${uid}`);
    return await deleteRequest(url);
  },

  async createOrDeleteWishlist({uid, formData}) {
    return await uid?this.deleteWishlist(uid):this.createWishlist(formData);
  },

};
