import React, { useEffect } from 'react';
import { Spinner } from 'theme-ui';
import http from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { authenticate, AuthenticationMethod } from '../api';
import { useAuthentication } from './context';
import { HOME_PATH } from '../paths';

export const AuthenticationCallbackPage = () => {
  const queryParams = useQuery();
  const { authenticate: saveToken } = useAuthentication();
  const history = useHistory();

  useEffect(() => {
    const cancelToken = http.CancelToken.source();

    async function authenticateWithMethod() {
      const method = AuthenticationMethod[queryParams.get('method') as AuthenticationMethod];
      const authCode = queryParams.get(authenticationMethodAuthCodeQueryParameter[method]);
      if (method && authCode) {
        try {
          const token = await authenticate(method, authCode, {
            cancelToken: cancelToken.token,
          });
          saveToken(token);
          history.replace(HOME_PATH);
        } catch (error) {
          if (!http.isCancel(error)) {
            history.replace('/login?invalid=true');
          }
        }
      } else {
        history.replace('/login?invalid=true');
      }
    }

    authenticateWithMethod();

    return () => cancelToken.cancel();
  }, [saveToken, history, queryParams]);

  return <Spinner variant="spinner.main" />;
};

const authenticationMethodAuthCodeQueryParameter: Record<AuthenticationMethod, string> = {
  ESTONIAN_ID: 'session_token',
  MAGIC_LINK: 'authCode',
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
