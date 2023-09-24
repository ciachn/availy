
import { Router, Api } from 'riza';
import { authStatus, userData } from './signals';

export function checkAuth()
{
    Api.fetch('account/get').then(r =>
    {
        if (r.response != 200) {
            authStatus.set(authStatus.NOT_AUTH);
            Router.navigate('/login/');
            return;
        }

        authStatus.set(authStatus.AUTH);
        userData.set(r);
        Router.navigate('/home/');
    });
}

export function signOut()
{
    Api.fetch('auth/logout').then(r =>
    {
        authStatus.set(authStatus.NOT_AUTH);
        Router.navigate('/login/');
    });
}
