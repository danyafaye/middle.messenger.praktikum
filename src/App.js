import Handlebars from 'handlebars';
import * as Pages from "./pages/index.js";

import Button from './components/Button.js';
import Title from './components/Title.js';
import Input from './components/Input.js';
import Link from './components/Link.js';
import H1 from './components/H1.js';
import H2 from './components/H2.js';
import Footer from './components/Footer.js';

Handlebars.registerPartial('Button', Button)
Handlebars.registerPartial('Title', Title)
Handlebars.registerPartial('Input', Input)
Handlebars.registerPartial('Link', Link)
Handlebars.registerPartial('H1', H1)
Handlebars.registerPartial('H2', H2)

let personalInfo = true;

export const navigateTo = (e, url) => {
    history.pushState(null, null, url);
    render();
}

const footer = Handlebars.compile(Footer)
const signInTemplate = Handlebars.compile(Pages.SignInPage)
const signUpTemplate = Handlebars.compile(Pages.SignUpPage)
const page404Template = Handlebars.compile(Pages.Page404)
const page500Template = Handlebars.compile(Pages.Page500)
const chatPageTemplate = Handlebars.compile(Pages.ChatPage)
const profilePageTemplate = Handlebars.compile(Pages.ProfilePage)

export const render = () => {
    const path = window.location.pathname;
    const routes = {
        "/": signInTemplate,
        '/sign-up': signUpTemplate,
        '/404': page404Template,
        '/500': page500Template,
        '/chat': chatPageTemplate,
        '/profile': profilePageTemplate({
            personalInfo
        }),
    };
    const page = routes[path] || page404Template;
    document.getElementById("app").innerHTML = `${typeof page === 'string' ? page : page()} ${footer({})}`;
    if(['/','/404'].includes(path)) {
        const linkToSignUp = document.getElementById('link-to-sign-up');
        linkToSignUp.addEventListener('click', (e) => {
            navigateTo(e, 'sign-up')
        })
    }
    if(path === '/sign-up') {
        const linkToSignIn = document.getElementById('link-to-sign-in');
        linkToSignIn.addEventListener('click', (e) => {
            navigateTo(e, '/')
        })
    }
    const linkToAuthorization = document.getElementById('link-to-authorization');
    linkToAuthorization.addEventListener('click', (e) => {
        navigateTo(e, '/')
    })
    const linkTo404 = document.getElementById('link-to-404');
    linkTo404.addEventListener('click', (e) => {
        navigateTo(e, '/404')
    })
    const linkTo500 = document.getElementById('link-to-500');
    linkTo500.addEventListener('click', (e) => {
        navigateTo(e, '/500')
    })
    const linkToProfile = document.getElementById('link-to-profile');
    linkToProfile.addEventListener('click', (e) => {
        navigateTo(e, '/profile')
    })
    const linkToChat = document.getElementById('link-to-chat');
    linkToChat.addEventListener('click', (e) => {
        navigateTo(e, '/chat')
    })
    if(path === '/profile') {
        const tabPersonalInfo = document.getElementById('tab-personal-info');
        const tabChangePass = document.getElementById('tab-change-pass');
        tabPersonalInfo.addEventListener("click", () => {
            personalInfo = true;
            render();
        })
        tabChangePass.addEventListener("click", () => {
            personalInfo = false;
            render();
        })
        const profileBack = document.getElementById('profile-side-button');
        profileBack.addEventListener('click', () => {
            history.back();
        })
        const avatarChangeText = document.getElementById('avatar-change-text');
        const avatarIcon = document.getElementById('avatar-icon');
        avatarIcon.addEventListener('mouseenter', () => {
            avatarChangeText.classList.add('show')
        })
        avatarIcon.addEventListener('mouseleave', () => {
            avatarChangeText.classList.remove('show')
        })
    }
}
