import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Typography, Image, Space, Row, Col, Divider, List, message, Input, Button } from 'antd';
import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import useLogStore from '../../store/logStore';
import { getAuthInfo } from '../../utils/localStorage';
import './index.scss';  // SCSS import 추가
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PLACEHOLDER_IMAGES = [
  '/api/placeholder/800/600',
  '/api/placeholder/800/600',
  '/api/placeholder/800/600'
];

const FriendLogDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [comments, setComment] = useState('');
  const { fetchLog, currentLog, likeLog, addComment, likedLogs, fetchLikedPosts } = useLogStore();
  const userEmail = getAuthInfo('email');
  const username = getAuthInfo('username');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchLog(id, userEmail),
          fetchLikedPosts()  // 좋아요 상태 가져오기
        ]);
      } catch (error) {
        message.error('로그를 불러오는데 실패했습니다.');
        console.error('Error loading log:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, fetchLog, userEmail, fetchLikedPosts]);

  const handleLikeClick = async () => {
    try {
      await likeLog(id);
      const isCurrentlyLiked = likedLogs.has(Number(id));
      message.success(isCurrentlyLiked ? '좋아요를 취소했습니다.' : '좋아요를 눌렀습니다.');
    } catch (error) {
      message.error('좋아요 처리에 실패했습니다.');
      console.error('Error handling like:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comments.trim()) {
      message.warning('댓글 내용을 입력해주세요.');
      return;
    }
  
    try {
      await addComment(id, {
        logId: Number(id),
        content: comments,
        date: dayjs().format('YYYY-MM-DD')
      });
      message.success('댓글이 등록되었습니다.');
      setComment('');
    } catch (error) {
      message.error('댓글 등록에 실패했습니다.');
      console.error('Error posting comments:', error);
    } finally {
      location.reload();
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!currentLog) return <div>로그를 찾을 수 없습니다.</div>;

  const displayImages = currentLog.images?.length > 0 
    ? currentLog.images 
    : PLACEHOLDER_IMAGES;

  const isLiked = likedLogs.has(Number(id));

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center">
          <Avatar size={64}>
            {currentLog.username?.slice(0, 1)}
          </Avatar>
          <div>
            <Title level={4}>{currentLog.username}</Title>
            <Text type="secondary">{dayjs(currentLog.date).format('YYYY-MM-DD HH:mm')}</Text>
          </div>
        </Space>

        <Title level={3}>{currentLog.title}</Title>
        
        <div 
          className="ProseMirror" 
          style={{
            padding: '1rem',
            border: '1px solid #f0f0f0',
            borderRadius: '4px',
            minHeight: '200px',
            backgroundColor: '#fff'
          }}
          dangerouslySetInnerHTML={{ __html: currentLog.content }}
        />

        <Image.PreviewGroup>
          <Row gutter={[16, 16]}>
            {displayImages.map((_, index) => (
              <Col span={8} key={index}>
                <Image
                  src={`/api/placeholder/800/600?text=Image${index + 1}`}
                  alt={`travel image ${index + 1}`}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>

        <Space size="large">
          <Space onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
            {isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            <span>{currentLog.liked || 0}</span>
          </Space>
          <Space>
            <MessageOutlined />
            <span>{currentLog.comments?.length || 0}</span>
          </Space>
          <ShareAltOutlined />
        </Space>

        <Divider />

        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={comments}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력해주세요"
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={handleCommentSubmit}>
            등록
          </Button>
        </Space.Compact>

        {currentLog.comments && currentLog.comments.length > 0 ? (
          <List
            header={`${currentLog.comments.length} 댓글`}
            itemLayout="horizontal"
            dataSource={currentLog.comments}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{item.writer?.username?.slice(0, 1)}</Avatar>}
                  title={item.writer?.username}
                  description={
                    <Space direction="vertical" size="small">
                      <Text>{item.content}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(item.date).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">첫 댓글을 작성해보세요!</Text>
        )}
      </Space>
    </Card>
  );
};

export default FriendLogDetail;