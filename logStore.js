import axios from 'axios';
import { getAuthInfo } from '../utils/localStorage';
import handleApi from './handler';
import dayjs from 'dayjs';

export const logAPI = {
  // 로그 목록 조회
  getLogs: async (email) => {
    const response = await handleApi('get', '/logs', { email });
    return response.data;
  },

  // 단일 로그 조회
  getLog: async (logId) => {
    const response = await handleApi('get', `/log/${logId}`);
    return response.data;
  },

  //로그 생성
  createLog: async (logData, images) => {
    const form = new FormData();
    // content는 TipTap에서 HTML 형식으로 저장됨
    const requestData = {
      planId: Number(logData.planId),
      title: logData.title,
      content: logData.content,  // HTML 형식의 content
      visibility: logData.visibility,
      date: dayjs().format('YYYY-MM-DD HH:mm')
    };

    // JSON을 Blob으로 변환
    const json = JSON.stringify(requestData);
    const blob = new Blob([json], { type: "application/json" });

    // 요청 본문 구성
    form.append('data', blob);

    // 이미지가 있는 경우에만 추가
    if (images && images.length > 0) {
      images.forEach((image) => {
        form.append('images', image);
      })
    } else {
      form.append('images', null)
    }

    const token = getAuthInfo('token');

    const response = await axios.post(
      '/api/log',
      form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
    );

    // HTML content를 포함한 응답 반환
    return response.data;
  },

  // 로그 수정

  updateLog: async (logId, logData) => {
    const token = getAuthInfo('token');
    const response = await handleApi(
      'put',
      `/log/${logId}`,  // PathVariable로 변경
      null,
      {
        planId: Number(logData.planId),  // planId를 숫자로 변환
        title: logData.title,
        content: logData.content,
        date: logData.date,
        visibility: logData.visibility
      },
      {
        Authorization: `Bearer ${token}`  // 토큰 추가
      }
    );
    return response.data;
  },

  // 로그 삭제
  deleteLog: async (logId) => {
    const token = getAuthInfo('token');
    await handleApi(
      'delete',
      `/log/${logId}`,  // URL 패턴 변경
      null,
      null,
      {
        Authorization: `Bearer ${token}`  // 토큰 추가
      }
    );
  },

  toggleLike: async (logId) => {
    const token = getAuthInfo('token');
    const response = await handleApi(
      'post',
      '/like',
      null,
      { logId: Number(logId) },  // 단순히 logId만 전송
      {
        Authorization: `Bearer ${token}`  // 토큰 추가
      }
    );
    return response.data;
  },


  // 좋아요한 게시글 조회
  getLikedPosts: async () => {
    const token = getAuthInfo('token');
    const response = await handleApi(
      'get',
      '/liked-posts',
      null,
      null,
      {
        Authorization: `Bearer ${token}`  // 토큰 추가
      }
    );
    return response.data;  // { data: [...] } 형태로 반환됨
  },


  // 친구 로그 조회
  getFriendLogs: async () => {
    const response = await handleApi('get', '/logs-friend');
    return response.data;
  },

  // 댓글 추가
  addComment: async (logId, content) => {
    const response = await handleApi('post', '/comment', null, {
      'log-id': logId,
      ...content
    });
    return response.data;
  }
};