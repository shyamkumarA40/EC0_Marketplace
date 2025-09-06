const auth = {
    logout() {
        localStorage.removeItem('ecofinds-token');
        localStorage.removeItem('ecofinds-user');
        window.location.href = './login.html';
    },
    isLoggedIn() { return !!localStorage.getItem('ecofinds-token'); },
    getToken() { return localStorage.getItem('ecofinds-token'); },
    getUser() {
        const user = localStorage.getItem('ecofinds-user');
        return user ? JSON.parse(user) : null;
    },
    login(token, user) {
        localStorage.setItem('ecofinds-token', token);
        localStorage.setItem('ecofinds-user', JSON.stringify(user));
    }
};