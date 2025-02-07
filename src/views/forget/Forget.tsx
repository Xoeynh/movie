import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from 'react-redux';
import { viewHeight } from '@/utils/screen';
import {
  fieldAccount,
  getCaptcha,
  filedCaptcha,
  filedPhoneCode,
  modifyPassword
} from '@/api/user';
import type { Navigation, TextInputEvent, ResponseType } from '@/types/index';
import CustomAlert from '@/components/custom-alert/CustomAlert';
import PicutreCode from '@/components/picture-code/PicutreCode';
import styles from './forget.css';

function Forget(): React.ReactElement {
  const navigation: Navigation = useNavigation();
  const store = useStore();

  const [formData, setFormData] = useState({
    account: '',
    password: '',
    code: ''
  });

  const handleInputChange = (e: TextInputEvent, name: string) => {
    setFormData({ ...formData, [name]: e.nativeEvent.text });
  };

  const handleClearInput = (name: string) => {
    setFormData({ ...formData, [name]: '' });
  };

  // 倒计时逻辑
  const [codeTime, setCodeTime] = useState({
    visible: false,
    time: 120
  });
  const timer = useRef<NodeJS.Timeout>();

  const handleTimeText = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }

    setCodeTime({ ...codeTime, visible: true });

    timer.current = setInterval(() => {
      setCodeTime(state => {
        if (state.time <= 1) {
          clearInterval(timer.current);
          return { visible: false, time: 120 };
        }

        return { visible: true, time: state.time - 1 };
      });
    }, 1000);
  };

  useEffect(() => {
    return timer.current && clearInterval(timer.current);
  }, []);

  // 进度
  const [progress, setProgress] = useState(0);

  // 验证手机号
  const handleFieldAccount = (): boolean | undefined => {
    if (!formData.account) {
      CustomAlert({ title: '提示', message: '请先输入手机号' });
      return;
    }

    fieldAccount({ account: formData.account })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          setProgress(1);
        } else {
          CustomAlert({ title: '提示', message: res?.message });
        }
      })
      .catch(() => ({}));
  };

  const [captcha, setCaptcha] = useState({
    visible: false,
    img: ''
  });

  // 获取图片验证码
  const handleGetCaptcha = () => {
    getCaptcha()
      .then((res: ResponseType<string>) => {
        if (res.code === 200) {
          setCaptcha({ ...captcha, visible: true, img: res?.data || '' });
        } else {
          CustomAlert({ title: '提示', message: res?.message });
        }
      })
      .catch(() => ({}));
  };

  // 校验图片验证码并发送短信验证码
  const handleCaptchaComplete = (code: string) => {
    filedCaptcha({
      phone: formData.account,
      code,
      type: 'forget'
    })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          setProgress(2);

          setCaptcha({ ...captcha, visible: false });
          handleTimeText();

          CustomAlert({ title: '提示', message: res?.message });
          return;
        }

        // 短信验证上限
        if (res.code === 450) {
          setCaptcha({ ...captcha, visible: false });
          CustomAlert({ title: '提示', message: res?.message });
          return;
        }

        handleGetCaptcha();
        CustomAlert({ title: '提示', message: res?.message });
      })
      .catch(() => ({}));
  };

  const handleCaptchaClose = () => {
    setCaptcha({ ...captcha, visible: false });
  };

  // 校验短信验证码
  const handleFiledPhoneCode = () => {
    filedPhoneCode({ phone: formData.account, code: formData.code })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          setProgress(3);

          store.dispatch({
            type: 'routine/setToken',
            payload: res?.data?.token
          });
        } else {
          CustomAlert({ title: '提示', message: res?.message });
        }
      })
      .catch(() => ({}));
  };

  // 修改密码
  const handleModifyPassword = () => {
    modifyPassword({ password: formData.password })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          CustomAlert({ title: '提示', message: res?.message });
          store.dispatch({
            type: 'routine/setLogout',
            payload: ''
          });
          navigation.replace('Login');
        } else {
          CustomAlert({ title: '提示', message: res?.message });
        }
      })
      .catch(() => ({}));
  };

  const nextStep = () => {
    // 验证手机号
    if (progress === 0) {
      handleFieldAccount();
    }

    // 获取图片验证码
    if (progress === 1) {
      handleGetCaptcha();
    }

    // 校验短信验证码
    if (progress === 2) {
      handleFiledPhoneCode();
    }

    // 修改密码
    if (progress === 3) {
      handleModifyPassword();
    }
  };

  return (
    <View style={styles.page}>
      {progress === 0 && (
        <View style={styles.fieldItem}>
          <Text style={styles.itemText}>手机号码</Text>
          <TextInput
            value={formData.account}
            onChange={e => {
              handleInputChange(e, 'account');
            }}
            placeholder="请输入注册手机号"
            style={styles.itemInput}
          />
          {Boolean(formData.account) && (
            <Pressable onPress={() => handleClearInput('account')}>
              <Text style={styles.inputClearIcon}>{'\ue637'}</Text>
            </Pressable>
          )}
        </View>
      )}
      {(progress === 1 || progress === 2) && (
        <>
          <View style={styles.fieldItem}>
            <TextInput
              value={formData.code}
              onChange={e => {
                handleInputChange(e, 'code');
              }}
              placeholder="请输入验证码"
              style={styles.itemCodeInput}
            />
            <Text onPress={handleGetCaptcha} style={styles.codeText}>
              {codeTime.visible ? `${codeTime.time}s` : '获取验证码'}
            </Text>
          </View>
          <Text style={styles.tipText}>验证码会发送至您注册的手机号</Text>
        </>
      )}
      {progress === 3 && (
        <View style={styles.fieldItem}>
          <Text style={styles.itemText}>新密码</Text>
          <TextInput
            value={formData.password}
            onChange={e => {
              handleInputChange(e, 'password');
            }}
            placeholder="请输入新密码"
            style={styles.itemInput}
          />
          {Boolean(formData.password) && (
            <Pressable onPress={() => handleClearInput('password')}>
              <Text style={styles.inputClearIcon}>{'\ue637'}</Text>
            </Pressable>
          )}
        </View>
      )}
      <Pressable onPress={nextStep} style={styles.submit}>
        <Text style={styles.submitText}>
          {progress === 3 ? '提交' : '下一步'}
        </Text>
      </Pressable>
      {captcha.visible && (
        <PicutreCode
          image={captcha.img}
          complete={handleCaptchaComplete}
          close={handleCaptchaClose}
          picutreStyle={{
            height: Platform.OS === 'web' ? viewHeight - 42 : viewHeight
          }}
          maskStyle={{
            height: Platform.OS === 'web' ? viewHeight - 42 : viewHeight
          }}
        />
      )}
    </View>
  );
}

export default Forget;
