import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { register, getCaptcha, filedCaptcha, filedPhoneCode } from '@/api/user';
import type { Navigation, TextInputEvent, ResponseType } from '@/types/index';
import CustomAlert from '@/components/custom-alert/CustomAlert';
import PicutreCode from '@/components/picture-code/PicutreCode';

function RegisterForm(): React.ReactElement {
  const navigation: Navigation = useNavigation();

  const [formData, setFormData] = useState({
    account: '',
    password: '',
    code: ''
  });

  const handleInputChange = (e: TextInputEvent, name: string) => {
    setFormData({ ...formData, [name]: e.nativeEvent.text });
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

  const [captcha, setCaptcha] = useState({
    visible: false,
    img: ''
  });

  // 获取图片验证码
  const handleGetCaptcha = () => {
    if (!formData.account) {
      CustomAlert({ title: '提示', message: '请先输入手机号' });
      return;
    }
    if (!formData.password) {
      CustomAlert({ title: '提示', message: '请先输入密码' });
      return;
    }

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
      type: 'register'
    })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          setCaptcha({ ...captcha, visible: false });
          handleTimeText();

          CustomAlert({ title: '提示', message: res?.message });
          return;
        }

        // 手机号已注册
        if (res.code === 403) {
          setCaptcha({ ...captcha, visible: false });
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
  const handleFiledPhoneCode = (): Promise<ResponseType> => {
    return new Promise(resolve => {
      filedPhoneCode({ phone: formData.account, code: formData.code! })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            resolve(res);
          } else {
            CustomAlert({ title: '提示', message: res?.message });
          }
        })
        .catch(() => ({}));
    });
  };

  const submit = async (): Promise<boolean | undefined> => {
    if (!formData.account) {
      CustomAlert({ title: '提示', message: '请先输入手机号' });
      return;
    }
    if (!formData.password) {
      CustomAlert({ title: '提示', message: '请先输入密码' });
      return;
    }

    const filedCode = await handleFiledPhoneCode();
    if (!filedCode.code) {
      CustomAlert({ title: '提示', message: filedCode?.message });
      return;
    }

    register({ ...formData })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          CustomAlert({ title: '提示', message: res?.message });
          navigation.replace('Login');
        } else {
          CustomAlert({ title: '提示', message: res?.message });
        }
      })
      .catch(() => ({}));
  };

  return (
    <>
      <Text style={styles.title}>注册</Text>
      <View style={styles.form}>
        <View style={styles.formItem}>
          <TextInput
            value={formData.account}
            onChange={e => {
              handleInputChange(e, 'account');
            }}
            placeholder="请输入手机号"
            style={styles.itemInput}
          />
        </View>
        <View style={styles.formItem}>
          <TextInput
            value={formData.password}
            onChange={e => {
              handleInputChange(e, 'password');
            }}
            autoComplete="off"
            placeholder="请设置初始密码(6-12位)"
            style={styles.itemInput}
          />
        </View>
        <View style={styles.formItem}>
          <TextInput
            value={formData.code}
            onChange={e => {
              handleInputChange(e, 'code');
            }}
            placeholder="请输入验证码"
            style={styles.itemInput}
          />
          <Text onPress={handleGetCaptcha} style={styles.codeText}>
            {codeTime.visible ? `${codeTime.time}s` : '获取验证码'}
          </Text>
        </View>
        <Pressable onPress={submit} style={styles.submit}>
          <Text style={styles.submitText}>注 册</Text>
        </Pressable>
      </View>
      {captcha.visible && (
        <PicutreCode
          image={captcha.img}
          complete={handleCaptchaComplete}
          close={handleCaptchaClose}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 45,
    marginTop: 45,
    fontWeight: '700',
    fontSize: 22,
    color: '#303133'
  },
  form: {
    paddingTop: 34,
    paddingHorizontal: 45
  },
  formItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 68,
    paddingTop: 22,
    borderBottomWidth: 0.4,
    borderStyle: 'solid',
    borderColor: '#eee'
  },
  itemInput: {
    flex: 1,
    height: 45
  },
  codeText: {
    height: 45,
    lineHeight: 45,
    fontSize: 11,
    color: '#e54847'
  },
  submit: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginTop: 34,
    backgroundColor: '#409eff',
    textAlign: 'center',
    borderRadius: 2
  },
  submitText: {
    fontSize: 14,
    color: '#fff'
  }
});

export default RegisterForm;
