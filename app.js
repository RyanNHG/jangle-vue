const store = new Vuex.Store({

    state: {
        currentPage: '/app/collections',
        user: null
    },

    mutations: {

        setUser: (state, payload) => {
            state.user = payload;
        },
        setPage: (state, newPage) => {
            state.currentPage = newPage;
        }

    }

});

Vue.component('sign-in-page', {

    template: '#signInPageTemplate'

});

Vue.component('sign-in-form', {

    template: '#signInFormTemplate',

    data: function() {
        return {
            username: '',
            password: '',
            isLoading: false,
            errorMessage: '',
            errorMessages: {
                blankFields: 'Username and password are required.'
            }
        };
    },

    computed: {
        signInButtonClasses: function() {
            return [
                'button',
                'is-primary',
                'is-pulled-right',
                'is-medium',
                {
                    'is-loading': this.isLoading,
                    'is-disabled': this.hasEmptyFields
                }
            ];
        },
        inputClasses: function() {
            return [
                'input',
                'is-medium',
                {
                    'is-danger': this.highlightInput
                }
            ];
        },
        hasEmptyFields: function(){
            return this.username == '' || this.password == '';
        },
        highlightInput: function(){
            return this.errorMessage == this.errorMessages.blankFields;
        }
    },

    methods: {
        loginUser: function() {
            var self = this;

            if(self.isLoading)
                return;

            if(self.hasEmptyFields)
            {
                self.errorMessage = self.errorMessages.blankFields;
            }
            else
            {
                self.errorMessage = '';
                self.isLoading = true;
                setTimeout(function(){
                    store.commit('setUser', {
                        username: self.username, 
                        password: self.password
                    });
                    store.commit('setPage', '/app/collections');
                    self.isLoading = true;
                }, 1000);
            }

        }
    }

});

Vue.component('collections-page', {
    template: '#collectionsPageTemplate'
});

Vue.component('navbar', {
    template: '#navbarTemplate',

    data: function(){
        return {
            navHeader: 'Collections'
        };
    },

    methods: {
        signOut: function(){
            store.commit('setUser', null);
            store.commit('setPage', '/login');
        }
    }
});

Vue.component('side-nav', {
    template: '#sideNavTemplate'
});

new Vue({
    el: '#app',

    computed: {
        currentPage: function() {
            return store.state.currentPage;
        }
    }
});