import React, { useState } from 'react';
import { Button, Steps, message, Spin, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLogStore from '@/store/logStore';
import { LogSettings } from './LogSettings';
import { LogWriting } from './LogWriting';
import LogPreview from './LogPreview';
import './index.scss';

export const Add = () => {
  const navigate = useNavigate();
  const { createLog } = useLogStore();

  const [logData, setLogData] = useState({
    title: '',
    content: '',
    planId: null,
    visibility: 'private',
  });

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleVisibilityChange = (newVisibility) => {
    setLogData(prev => ({ ...prev, visibility: newVisibility }));
  };

  const handlePublish = async () => {
    if (!logData.planId || !logData.title || !logData.content) {
      message.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await createLog(logData, images);
      if (response) {
        message.success('로그가 성공적으로 발행되었습니다!');
        navigate(`/base/log/detail/${response.logId}`);
      }
    } catch (error) {
      console.error('Publish Error:', error);
      message.error('로그 발행 중 오류가 발생했습니다.');
    }
  };

  const handleImagesChange = (file) => {
    setImages((state) => [...state, file]);
  };

  const handleImageUrlsChange = (files) => {
    setImageUrls(files)
  }
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <LogSettings
            selectedPlan={logData.planId}
            onPlanSelect={(planId) => setLogData(prev => ({ ...prev, planId }))}
            onImagesChange={handleImagesChange}
            onImageUrlsChange={handleImageUrlsChange}
          />
        );
      case 1:
        return (
          <LogWriting
            title={logData.title}
            content={logData.content}
            onTitleChange={(title) => setLogData(prev => ({ ...prev, title }))}
            onContentChange={(content) => setLogData(prev => ({ ...prev, content }))}
          />
        );
      case 2:
        return (
          <LogPreview
            title={logData.title}
            logContent={logData.content}
            visibility={logData.visibility}
            onVisibilityChange={handleVisibilityChange}
            images={imageUrls}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-log">
      <Steps
        direction='vertical'
        current={currentStep}
        style={{ width: "20vw", margin: '48px 0' }}
        items={[
          { title: '설정' },
          { title: '작성' },
          { title: '미리보기' }
        ]}
      />
      <div className="form-container">
        {renderStepContent()}
        <div className="button-container">
          {currentStep > 0 && (
            <Button
              size="large"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              이전
            </Button>
          )}
          <div>
            {currentStep < 2 ? (
              <Button
                type="primary"
                size="large"
                onClick={() => setCurrentStep(prev => prev + 1)}
              >
                다음
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={handlePublish}
              >
                발행
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};