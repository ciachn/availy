
import "./css/xui.css"
import "./css/main.css"

import Login from './login';
import CreateAccount from './create-account';
import Home from './home';

import { checkAuth } from './actions';

export default () =>
    <r-panel class="app f-row" onRootReady={ () => checkAuth() } >
        <div class="f-col s-10 s-4-md s-3-lg s-2h-xl mx-auto">

            <Login />
            <CreateAccount />
            <Home />

        </div>
    </r-panel>
;
