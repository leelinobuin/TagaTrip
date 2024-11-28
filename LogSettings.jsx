import React, { useState, useEffect } from 'react';
import { Select, Upload, Button, Typography, message, Steps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getPlans } from '@/api/plan';

const { Title } = Typography;
const { Option } = Select;

export const LogSettings = ({ selectedPlan, onPlanSelect, onImagesChange, onImageUrlsChange }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getPlans();
        setPlans(plansData);
        if (plansData.length > 0 && !selectedPlan) {
          onPlanSelect(plansData[0].planId);
        }
      } catch (error) {
        console.error('여행 계획을 불러오는데 실패했습니다:', error);
        message.error('여행 계획을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleUploadChange = ({ fileList: newFileList }) => {
    // 파일 크기 및 타입 검증
    const validFiles = newFileList.filter(file => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      const isImage = file.type?.startsWith('image/');

      if (!isLt5M) {
        message.error(`${file.name} 파일은 5MB를 초과할 수 없습니다.`);
        return false;
      }
      if (!isImage) {
        message.error(`${file.name} 파일은 이미지 형식이어야 합니다.`);
        return false;
      }
      return true;
    });

    setFileList(validFiles);

    // 부모 컴포넌트에 파일 객체들 전달
    const files = validFiles.map(file => file.originFileObj);
    onImageUrlsChange(files);
  };

  const handleBeforeUpload = (file) => {
    onImagesChange(file);
    return false;
  }

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', margin: '16px 36px' }}>
      <Steps
        direction='vertical'
        current={0}
        style={{ width: "20vw" }}
        items={[
          { title: '여행 선택' },
          { title: '이미지 업로드' }
        ]}
      />
      <div style={{
        flex: 1,
        marginLeft: '36px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}>
        <Title level={3}>여행 선택</Title>
        <Select
          value={selectedPlan}
          style={{ width: 200, marginBottom: 20 }}
          onChange={onPlanSelect}
          loading={loading}
        >
          {plans.map(plan => (
            <Option key={plan.planId} value={plan.planId}>{plan.title}</Option>
          ))}
        </Select>

        <Title level={3}>이미지</Title>
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={handleBeforeUpload}
          onChange={handleUploadChange}
          multiple={true}
          accept="image/*"
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <div style={{ marginTop: 8, color: 'gray', fontSize: '12px' }}>
          * 최대 8장까지 업로드 가능합니다.
          * 파일당 최대 5MB까지 가능합니다.
        </div>
      </div>
    </div>
  );
};

export default LogSettings;