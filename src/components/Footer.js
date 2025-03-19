//language=hbs
export default (`<footer class="footer-template">
    <nav>
        <ul class="footer-list">
            <li>
                {{> Link href='/' id='link-to-404' text='404 Страница' variant='primary' }}
            </li>
            <li>
                {{> Link href='/' id='link-to-500' text='5** Страница' variant='primary' }}
            </li>
            <li>
                {{> Link href='/' id='link-to-profile' text='Страница профиля' variant='primary' }}
            </li>
            <li>
                {{> Link href='/' id='link-to-chat' text='Страница чата' variant='primary' }}
            </li>
            <li>
                {{> Link href='/' id='link-to-authorization' text='Страница входа/регистрации' variant='primary' }}
            </li>
        </ul>
    </nav>
</footer>`)