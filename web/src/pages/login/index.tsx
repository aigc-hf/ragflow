import { useLogin, useRegister } from '@/hooks/loginHooks';
import { useOneNamespaceEffectsLoading } from '@/hooks/storeHooks';
import { rsaPsw } from '@/utils';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, useNavigate } from 'umi';

import { Domain } from '@/constants/common';
import styles from './index.less';

const Login = () => {
  const [title, setTitle] = useState('login');
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });

  // TODO: When the server address request is not accessible, the value of dva-loading always remains true.

  const signLoading = useOneNamespaceEffectsLoading('loginModel', [
    'login',
    'register',
  ]);

  const changeTitle = () => {
    setTitle((title) => (title === 'login' ? 'register' : 'login'));
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.validateFields(['nickname']);
  }, [form]);

  const onCheck = async () => {
    try {
      const params = await form.validateFields();

      const rsaPassWord = rsaPsw(params.password) as string;

      if (title === 'login') {
        const retcode = await login({
          email: params.email,
          password: rsaPassWord,
        });
        if (retcode === 0) {
          navigate('/knowledge');
        }
      } else {
        const retcode = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (retcode === 0) {
          setTitle('login');
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const formItemLayout = {
    labelCol: { span: 6 },
    // wrapperCol: { span: 8 },
  };

  const toGoogle = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?scope=user:email&client_id=302129228f0d96055bee';
  };

  return (
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div
            className="flex flex-col justify-center max-w-sm p-10 w-96 bg-white border border-b-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                className="mx-auto h-10 w-auto"
                src="/logo.svg"
                alt="AI研究院"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {title === 'login' ? t('login') : t('register')}
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form
                form={form}
                layout="vertical"
                name="dynamic_rule"
                style={{maxWidth: 600}}
                className="space-y-6"
            >
              <Form.Item
                  {...formItemLayout}
                  name="email"
                  label={t('emailLabel')}
                  rules={[{required: true, message: t('emailPlaceholder')}]}
              >
                <Input
                    size="large"
                    placeholder={t('emailPlaceholder')}
                />
              </Form.Item>
              {title === 'register' && (
                  <Form.Item
                      {...formItemLayout}
                      name="nickname"
                      label={t('nicknameLabel')}
                      rules={[{required: true, message: t('nicknamePlaceholder')}]}
                  >
                    <Input size="large" placeholder={t('nicknamePlaceholder')}/>
                  </Form.Item>
              )}
              <Form.Item
                  {...formItemLayout}
                  name="password"
                  label={t('passwordLabel')}
                  rules={[{required: true, message: t('passwordPlaceholder')}]}
              >
                <Input.Password
                    size="large"
                    placeholder={t('passwordPlaceholder')}
                    onPressEnter={onCheck}
                />
              </Form.Item>
              {title === 'login' && (
                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox> {t('rememberMe')}</Checkbox>
                  </Form.Item>
              )}
              <div>
                {title === 'login' && (
                    <div>
                      {t('signInTip')}
                      <Button type="link" onClick={changeTitle}>
                        {t('signUp')}
                      </Button>
                    </div>
                )}
                {title === 'register' && (
                    <div>
                      {t('signUpTip')}
                      <Button type="link" onClick={changeTitle}>
                        {t('login')}
                      </Button>
                    </div>
                )}
              </div>
              <Button
                  type="primary"
                  block
                  size="large"
                  onClick={onCheck}
                  loading={signLoading}
              >
                {title === 'login' ? t('login') : t('continue')}
              </Button>
              {title === 'login' && (
                  <>
                    {/* <Button
                  block
                  size="large"
                  onClick={toGoogle}
                  style={{ marginTop: 15 }}
                >
                  <div>
                    <Icon
                      icon="local:google"
                      style={{ verticalAlign: 'middle', marginRight: 5 }}
                    />
                    Sign in with Google
                  </div>
                </Button> */}
                    {location.host === Domain && (
                        <Button
                            block
                            size="large"
                            onClick={toGoogle}
                            style={{marginTop: 15}}
                        >
                          <div>
                            <Icon
                                icon="local:github"
                                style={{verticalAlign: 'middle', marginRight: 5}}
                            />
                            Sign in with Github
                          </div>
                        </Button>
                    )}
                  </>
              )}
            </Form>
          </div>
        </div>
      </div>
  );
};

export default Login;
