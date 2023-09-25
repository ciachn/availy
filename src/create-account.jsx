
import { Router } from 'riza';

export default () =>
    <r-panel data-route="/create-account/">

        <div class="text-center pt-6">
            <img src="logo.png" style:height="5.4rem" />
        </div>

        <div class="px-1">

            <r-form data-form-action="auth.signup" id="frmCreateAccount" onFormSuccess={ () => {
                    alert('Your account has been created.\nNow you can login.');
                    Router.navigate('/login/');
                }}>

                <div class="input-group">
                    <label>Name</label>
                    <input type="text" data-field="name" />
                </div>

                <div class="input-group">
                    <label>Phone</label>
                    <input type="tel" data-field="phone" />
                </div>

                <div class="input-group">
                    <label>Username</label>
                    <input type="text" data-field="username" />
                </div>

                <div class="input-group">
                    <label>Password</label>
                    <input type="password" data-field="password" />
                </div>

                <div class="input-group">
                    <label>Confirm Password</label>
                    <input type="password" data-field="rpassword" />
                </div>

                <div className="message error"></div>
            </r-form>

        </div>

        <div class="pt-3 pb-6">
            <button class="btn" onClick={ () => document.getElementById('frmCreateAccount').submit() }>
                <i class="fa fa-user-plus me-1"></i>
                Create Account
            </button>

            <span class="d-block text-center my-3"><small>- Or -</small></span>

            <button class="btn alt-1" onClick={ () => Router.navigate('/login/') }>
                <i class="fa fa-sign-in me-1"></i>
                Sign In
            </button>
            <button class="btn alt-1 mt-2" onClick={ () => Router.navigate('/recover-password/') }>
                <i class="fa fa-key me-1"></i>
                Recover Password
            </button>
        </div>

    </r-panel>
;
