import React, { useState, useEffect } from 'react';
import { List, Space, Row, Col, Typography, Card, Avatar, message } from 'antd';
import { HeartFilled, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useLogStore from '@/store/logStore';
import dayjs from 'dayjs';

const { Title } = Typography;

const FriendLogItem = ({ item }) => (
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
        title={<Link to={`/base/log/friend/${item.logId}`}>{item.title}</Link>}
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

const Follow = () => {
  const { friendLogs, fetchFriendLogs } = useLogStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFriendLogs = async () => {
      try {
        await fetchFriendLogs();
        setLoading(false);
      } catch (error) {
        console.error('친구들의 여행로그를 불러오는 데 실패했습니다:', error);
        message.error('친구들의 여행로그를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };
    loadFriendLogs();
  }, [fetchFriendLogs]);

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
          <Title level={4}>친구들의 여행로그</Title>
          {friendLogs?.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={friendLogs}
              renderItem={(item) => <FriendLogItem item={item} />}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              친구들의 여행로그가 없습니다.
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Follow;