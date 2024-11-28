import React, { useState, useEffect } from 'react';
import { Button, List, Space, Row, Col, Typography, Card, Avatar, Tag, message, Popconfirm } from 'antd';
import { 
  HeartOutlined, 
  MessageOutlined, 
  CloseOutlined, 
  EditOutlined, 
  PlusOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLogStore from '@/store/logStore';
import { getAuthInfo } from '@/utils/localStorage';
import dayjs from 'dayjs';
import './index.scss';

const { Title } = Typography;




const colorMap = {
  예정: '#aad9bb',
  진행중: '#2c8b70',
  종료: '#808080'
};
const TravelLogItem = ({ item, onDelete }) => {
  const navigate = useNavigate();

  // 로그 상세 페이지로 이동
  const handleLogClick = () => {
    navigate(`/base/log/detail/${item.logId}`);
  };

  // 로그 수정 페이지로 이동
  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/base/log/edit/${item.logId}`);
  };

  // 로그 삭제 처리
  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    try {
      await onDelete(item.logId);
      message.success('로그가 삭제되었습니다.');
    } catch (error) {
      console.error('Delete error:', error);
      message.error('로그 삭제에 실패했습니다.');
    }
  };

  return (
    <Card
      style={{ marginBottom: 16, cursor: 'pointer' }}
      onClick={handleLogClick}
      extra={
        <Popconfirm
          title="로그를 삭제하시겠습니까?"
          description="삭제된 로그는 복구할 수 없습니다."
          onConfirm={handleDeleteClick}
          okText="삭제"
          cancelText="취소"
          placement="left"
        >
          <CloseOutlined 
            style={{ fontSize: 20, color: '#ff4d4f' }} 
            onClick={e => e.stopPropagation()}
          />
        </Popconfirm>
      }
    >

      <List.Item
        key={item?.logId}
        actions={[
          <Space onClick={e => e.stopPropagation()}>
            <HeartOutlined />
            <span>{item?.liked || 0}</span>
          </Space>,
          <Space onClick={e => e.stopPropagation()}>
            <MessageOutlined />
            <span>{item?.comments?.length || 0}</span>
          </Space>,
          <Button 
            type="primary" 
            size="small" 
            onClick={handleEditClick}
          >
            로그 수정
          </Button>
        ]}
      >
         <List.Item.Meta
          avatar={
            <Avatar size={64}>
              {item?.images?.[0] ? (
                <img src={item.images[0]} alt="log" />
              ) : 'Log'}
            </Avatar>
          }
          title={
            <span>{item?.title}</span>  
          }
          description={
            <div>
              <p>{dayjs(item?.date).format('YYYY-MM-DD HH:mm')}</p>
              
            </div>
          }
        />
        {item?.content && (
           <div 
           className="log-preview"
           dangerouslySetInnerHTML={{ 
             __html: item.content.length > 200 
               ? `${item.content.substring(0, 200)}...` 
               : item.content 
           }}
         />
        )}
      </List.Item>
    </Card>
  );
};

const MyLog = () => {
  const navigate = useNavigate();
  const { logs, fetchLogs, deleteLog } = useLogStore();
  const email = getAuthInfo('email');
  const username = getAuthInfo('username'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      await fetchLogs(email);
    } catch (error) {
      console.error('로그 목록을 불러오는 데 실패했습니다:', error);
      message.error('로그 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId) => {
    try {
      await deleteLog(logId);
      await loadLogs(); // 목록 새로고침
    } catch (error) {
      throw error;
    }
  };

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
          <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
            <Title level={4}>{username}님의 여행로그</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => navigate('/base/log/add')}
            >
              여행로그 추가
            </Button>
          </Space>
          {logs?.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={logs}
              renderItem={(item) => (
                <TravelLogItem 
                  item={item} 
                  onDelete={handleDelete}
                />
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <Title level={4}>작성한 여행로그가 없습니다.</Title>
              <Button type="primary" onClick={() => navigate('/base/log/add')}>
                첫 여행로그 작성하기
              </Button>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default MyLog;