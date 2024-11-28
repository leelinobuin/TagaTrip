import React, { useState, useEffect } from 'react';
import { Button, Steps, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import useLogStore from '@/store/logStore';
import { LogSettings } from './LogSettings';
import { LogWriting } from './LogWriting';
import LogPreview from './LogPreview';
import './index.scss';

export const Edit = () => {
  const { logId } = useParams();
  const navigate = useNavigate();
  const { updateLog, fetchLog } = useLogStore();
  
  const [logData, setLogData] = useState({
    title: '',
    content: '',
    planId: null,
    imageUrl: '',
    visibility: 'private',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogData = async () => {
      try {
        const log = await fetchLog(logId);
        setLogData({
          title: log.title,
          content: log.content,
          planId: log.planId,
          imageUrl: log.images?.[0] || '',
          visibility: log.visibility || 'private',
        });
        setLoading(false);
      } catch (error) {
        console.error('로그 데이터 로딩 실패:', error);
        message.error('로그 데이터를 불러오는데 실패했습니다.');
        navigate('/base/log');
      }
    };

    if (logId) {
      loadLogData();
    }
  }, [logId, fetchLog, navigate]);

  const handleUpdate = async () => {
    if (!logData.planId || !logData.title || !logData.content) {
      message.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      const updateData = {
        planId: logData.planId,
        title: logData.title,
        content: logData.content,
        visibility: logData.visibility,
        images: logData.imageUrl ? [logData.imageUrl] : []
      };
      
      const response = await updateLog(logId, updateData);
      if (response) {
        message.success('로그가 성공적으로 수정되었습니다!');
        navigate(`/base/log/detail/${logId}`);
      }
    } catch (error) {
      console.error('Update Error:', error);
      message.error('로그 수정 중 오류가 발생했습니다.');
    }
  };

  const handleVisibilityChange = (newVisibility) => {
    setLogData(prev => ({ ...prev, visibility: newVisibility }));
  };

  const renderStepContent = () => {
    if (loading) return <Spin size="large" />;

    switch (currentStep) {
      case 0:
        return (
          <LogSettings
            selectedPlan={logData.planId}
            imageUrl={logData.imageUrl}
            onPlanSelect={(planId) => setLogData(prev => ({ ...prev, planId }))}
            onImageUpload={(imageUrl) => setLogData(prev => ({ ...prev, imageUrl }))}
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
                onClick={handleUpdate}
              >
                수정완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};