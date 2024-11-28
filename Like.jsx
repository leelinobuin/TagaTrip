import React, { useState, useEffect } from 'react';
import { List, Space, Row, Col, Typography, Card, Avatar, message } from 'antd';
import { HeartFilled, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useLogStore from '@/store/logStore';
import dayjs from 'dayjs';

const { Title } = Typography;

const LikedLogItem = ({ item }) => (
  <Card style={{ marginBottom: 16 }}>
    <List.Item
      key={item.title}
      extra={
        item.images?.[0] && (
          <img
            width={100}
            height={100}
            alt="log image"
            src={item.images[0]}
            style={{ objectFit: 'cover' }}
          />
        )
      }
    >
      <List.Item.Meta
        avatar={
          <Avatar size={64}>
            {item.images?.[0] ? (
              <img src={item.images[0]} alt="log" />
            ) : item.writer?.username?.slice(0, 2) || 'Log'}
          </Avatar>
        }
        title={<Link to={`/base/log/detail/${item.logId}`}>{item.title}</Link>}
        description={`${item.writer?.username}의 여행 로그 - ${dayjs(item.date).format('YYYY-MM-DD')}`}
      />
      <Space>
        <Space>
          <HeartFilled style={{ color: '#ff4d4f' }} />
          <span>{item.liked}</span>
        </Space>
        <Space>
          <MessageOutlined />
          <span>{item.comments?.length || 0}</span>
        </Space>
      </Space>
    </List.Item>
  </Card>
);

const Like = () => {
  const { likedPosts, fetchLikedPosts } = useLogStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikedPosts = async () => {
      try {
        await fetchLikedPosts();
        setLoading(false);
      } catch (error) {
        console.error('좋아요한 게시글을 불러오는 데 실패했습니다:', error);
        message.error('좋아요한 게시글을 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };
    loadLikedPosts();
  }, [fetchLikedPosts]);

  if (loading) {
    return (
      <Row>
        <Col span={24}>
          <Card loading={true} />
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col span={24}>
        <Card>
          <Title level={4}>내가 좋아요한 여행로그</Title>
          {likedPosts?.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={likedPosts}
              renderItem={(item) => <LikedLogItem item={item} />}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              좋아요한 여행로그가 없습니다.
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Like;