const BASE_URL = 'https://x-splash-gen.onrender.com';

export const URL = {
  LOGIN: `${BASE_URL}/users/login`,
  SIGNUP: `${BASE_URL}/users/register`,
  ME: `${BASE_URL}/users/me`,
  A_R_IMAGE_TO_COLLECTION: (collID, imageID) =>
    `${BASE_URL}/users/collections/${collID}/images/${imageID}`,

  GET_POSTS: `${BASE_URL}/images`,
  CREATE_POST: `${BASE_URL}/images/`,
  LIKE_IMAGE: (id) => `${BASE_URL}/images/like/${id}`,
  ADD_TAGS_TO_IMAGE: (id) => `${BASE_URL}/images/addTag/${id}`,
  G_POST_D_POST: (id) => `${BASE_URL}/images/${id}`,

  C_TAG_G_TAG: `${BASE_URL}/tags/`,
  U_TAG_D_TAG: (id) => `${BASE_URL}/tags/${id}`,

  GET_CRE_COLL: `${BASE_URL}/collections/`,
  G_U_D_COLL: (id) => `${BASE_URL}/collections/${id}`,

  CREATE_COMMENT: `${BASE_URL}/comments/`,
  REPLAY_COMMENT: `${BASE_URL}/comments/reply`,
  DELETE_COMMENT: (id) => `${BASE_URL}/comments/${id}`,
  GET_COMMENTS: (id) => `${BASE_URL}/comments/image/${id}`,
};
