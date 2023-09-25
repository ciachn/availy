
import { Router } from 'riza';

export default () =>
    <r-panel data-route="/login/">

        <div class="text-center pt-6">
            <img src="logo.png" style:height="5.4rem" />
        </div>

        <div class="px-1">

            <r-form data-form-action="auth.login" id="frmLogin" onFormSuccess={ () => {
                    Router.navigate('/home/');
                }}>

                <div class="input-group">
                    <label>Username</label>
                    <input type="text" data-field="username" />
                </div>

                <div class="input-group">
                    <label>Password</label>
                    <input type="password" data-field="password" />
                </div>

                <div className="message error"></div>
            </r-form>

        </div>

        <div class="pt-3 pb-6">
            <button class="btn" onClick={ () => document.getElementById('frmLogin').submit() }>
                <i class="fa fa-sign-in me-1"></i>
                Sign In
            </button>

            <span class="d-block text-center my-3"><small>- Or -</small></span>

            <button class="btn alt-1" onClick={ () => Router.navigate('/create-account/') }>
                <i class="fa fa-user-plus me-1"></i>
                Create Account
            </button>
            <button class="btn alt-1 mt-2" onClick={ () => Router.navigate('/recover-password/') }>
                <i class="fa fa-key me-1"></i>
                Recover Password
            </button>
        </div>

    </r-panel>
;
