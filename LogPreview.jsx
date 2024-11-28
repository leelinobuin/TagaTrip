import React from 'react';
import { Typography, Radio, Divider, Image, Space } from 'antd';

const { Title } = Typography;

const LogPreview = ({ 
  title,
  logContent, 
  visibility,
  onVisibilityChange,
  images
}) => {
  return (
    <>
      <Title level={3}>미리보기</Title>
      <div style={{ padding: '20px', border: '1px solid #d9d9d9', borderRadius: '4px', marginBottom: '20px' }}>
        <Title level={2}>{title}</Title>
        
        {/* 이미지 미리보기 추가 */}
        {images && images.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <Image.PreviewGroup>
              <Space wrap>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    style={{ 
                      width: 200,
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          </div>
        )}
        
        <Divider />
        <div dangerouslySetInnerHTML={{ __html: logContent }} className="preview-content" />
      </div>
      
      <Title level={3}>공개 설정</Title>
      <Radio.Group 
        value={visibility} 
        onChange={(e) => onVisibilityChange(e.target.value)}
        style={{ marginBottom: '20px' }}
      >
        <Radio.Button value="private">비공개</Radio.Button>
        <Radio.Button value="friends">친구공개</Radio.Button>
        <Radio.Button value="public">전체공개</Radio.Button>
      </Radio.Group>
    </>
  );
};

export default LogPreview;