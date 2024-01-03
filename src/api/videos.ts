import axios from '@/utils/axios';

type VideoListParams = {
  page: number;
  per_page: number;
};

/**
 * @description 视频列表
 * @param { Object } params
 * @param { number } [params.page] - 页数
 * @param { number } [params.per_page] - 条数
 */
export const videosList = ({ page, per_page }: VideoListParams) => {
  const params = { page, per_page };

  return axios.request({
    url: '/videos',
    method: 'get',
    params
  });
};

/**
 * @description 视频详情
 * @param { Object } params
 * @param { number } params.id - 视频id
 */
export const videosDetail = ({ id }: { id: number }) => {
  const params = { id };

  return axios.request({
    url: `/videos/${id}`,
    method: 'get',
    params
  });
};

/**
 * @description 视频详情 - 视频列表
 * @param { Object } params
 * @param { number } params.id - 视频id
 */
export const videosDetailList = ({ id }: { id: number }) => {
  const params = { id };

  return axios.request({
    url: `/movies/${id}/videos`,
    method: 'get',
    params
  });
};

/**
 * @description 视频详情 - 点赞
 * @param { Object } params
 * @param { number } params.id - 视频id
 */
export const videoLike = ({ id }: { id: number }) => {
  return axios.request({
    url: `/videos/${id}/like`,
    method: 'post'
  });
};

/**
 * @description 视频详情 - 取消点赞
 * @param { Object } params
 * @param { number } params.id - 视频id
 */
export const unVideoLike = ({ id }: { id: number }) => {
  return axios.request({
    url: `/videos/${id}/like`,
    method: 'delete'
  });
};

/**
 * @description 视频详情 - 收藏
 * @param { Object } params
 * @param { number } params.id - 影人id
 */
export const followVideo = ({ id }: { id: number }) => {
  return axios.request({
    url: `/user/videos/${id}/collections`,
    method: 'post'
  });
};

/**
 * @description 视频详情 - 取消收藏
 * @param { Object } params
 * @param { number } params.id - 影人id
 */
export const unFollowVideo = ({ id }: { id: number }) => {
  return axios.request({
    url: `/user/videos/${id}/collections`,
    method: 'delete'
  });
};

type VideoCommentParams = {
  id: number;
  page: number;
  per_page: number;
  sortby?: string;
};

/**
 * @description 视频详情 - 评论列表
 * @param { Object } params
 * @param { number } params.id - 视频id
 * @param { number } [params.page] - 页数
 * @param { number } [params.per_page] - 条数
 * @param { string } [params.sortby] - 排序参数
 */
export const videoComment = ({
  id,
  page,
  per_page,
  sortby
}: VideoCommentParams) => {
  const params = { page, per_page, sortby };

  return axios.request({
    url: `/videos/${id}/comments`,
    method: 'get',
    params
  });
};
