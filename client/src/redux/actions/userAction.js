import {
  ActionTypes
} from "../constants/action-types";
import axios from 'axios';

export const userLogged = (user) => {
  return {
    type: ActionTypes.USER_LOGGED,
    payload: user,
  };
};

export const addProfileDesign = (design) => {
  return {
    type: ActionTypes.ADD_PROFILE_DESIGN,
    payload: design,
  };
};

export const editDesign = ({
  title,
  description,
  id,
  price
}) => {
  return (dispatch) => {
    axios
      .patch("/design", {
        title,
        price,
        description,
        id
      })
      .then((response) => {
        if (response.data.status) {
          dispatch({
            type: ActionTypes.EDIT_DESIGN,
            payload: {
              title,
              price,
              description,
              id
            }
          });
          dispatch({
            type: ActionTypes.ALERT,
            payload: {
              message: response.data.message,
              type: "success",
              open: true,
            }
          });
        } else {
          dispatch({
            type: ActionTypes.ALERT,
            payload: {
              message: response.data.message,
              type: "error",
              open: true,
            }
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: error.response.data.message,
            type: "error",
            open: true,
          }
        });
      });
  }
};

export const deleteDesign = (id) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true
    })
    axios.delete("/design", {
        data: {
          id
        }
      })
      .then((response) => {
        if (response.data.deleted) {
          dispatch({
            type: ActionTypes.DELETE_DESIGN,
            payload: id
          })
          dispatch({
            type: ActionTypes.ALERT,
            payload: {
              message: response.data.message,
              type: "success",
              open: true
            }
          })
        } else {
          dispatch({
            type: ActionTypes.ALERT,
            payload: {
              message: response.data.message,
              type: "error",
              open: true
            }
          })
        }
        dispatch({
          type: ActionTypes.LOADING,
          payload: false
        })
      })
      .catch(err => {
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: err.response.data.message,
            type: "error",
            open: true
          }
        })
        dispatch({
          type: ActionTypes.LOADING,
          payload: false
        })
      })
  }
}


export const addCart = (id) => {
  return (dispatch) => {
    axios.post("/cart/add", {
        id
      })
      .then((response) => {
        dispatch({
          type: ActionTypes.ADD_CART,
          payload: [response.data.design]
        })
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: response.data.message,
            type: "success",
            open: true
          }
        })
      })
  }
};

export const removeCart = (id) => {
  return (dispatch) => {
    axios
      .post("/cart/remove", {
        id
      })
      .then((response) => {
        dispatch({
          type: ActionTypes.REMOVE_CART,
          payload: id
        });
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: response.data.message,
            type: "success",
            open: true
          }
        })
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: err.response.data.message,
            type: "error",
            open: true
          }
        })
      });
  }
};

export const addremWishlist = (id) => {
  return (dispatch) => {
    axios
      .post("/wish/addrem", {
        id,
      })
      .then((response) => {
        if (response.data.removed) {
          dispatch({
            type: ActionTypes.REMOVE_WISHLIST,
            payload: id
          })
        } else {
          dispatch({
            type: ActionTypes.ADD_WISHLIST,
            payload: [response.data.design],
          });
        }
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: response.data.message,
            type: "success",
            open: true
          }
        })
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: err.response.data.message,
            type: "error",
            open: true
          }
        })
      });
  }
};
export const changeTheme = (theme) => {
  localStorage.setItem('theme', theme);
  return (dispatch) => {
    dispatch({
      type: ActionTypes.THEME,
      payload: theme
    })
  }
};
export const editBasicProfile = (values) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LOADING,
      payload: true
    })
    axios.patch("/account", values).then(res => {
      dispatch({
        type: ActionTypes.LOADING,
        payload: false
      })
      if (res.data.status) {
        dispatch({type: ActionTypes.EDIT_PROFILE, payload: {...values, picture: res.data.picture}})
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: res.data.message,
            type: 'success',
            open: true
          }
        })
      } else {
        dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: res.data.message,
            type: 'error',
            open: true
          }
        })
      }
    }).catch(err => {
      dispatch({
          type: ActionTypes.ALERT,
          payload: {
            message: err.res.data.message,
            type: 'error',
            open: true
          }
        })
    })
  }
};



export const removeUser = () => {
  return {
    type: ActionTypes.REMOVE_USER,
  };
};