const store = new Vuex.Store({

    state: {
        currentPage: '/app/collections',
        user: null
    },

    getters: {
        view: function(state){

            switch(state.currentPage)
            {
                case '/app/collections':
                    return 'collections-page';
            }

            return 'sign-in-page';
        },
        navHeader: function(state){
            switch(state.currentPage)
            {
                case '/app/collections':
                    return 'Collections';
            }
            return '';
        }
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
        signInUser: function() {
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

    computed: {

        navHeader: function(){
            return store.getters.navHeader;
        }
    },

    methods: {
        signOut: function(){
            store.commit('setUser', null);
            store.commit('setPage', '/sign-in');
        }
    }
});

Vue.component('side-nav', {
    template: '#sideNavTemplate',

    data: function(){
        return {
            collections: [
                { label: 'Animals' },
                { label: 'Plants' },
                { label: 'Dinosaurs' },
                { label: 'Aliens' }
            ],
            filterQuery: '',
            allCollectionsLabel: 'All Collections'
        };
    },

    computed: {
        alphabetizedCollections: function(){
            return this.collections.sort( function(x,y) {
                return x.label < y.label;
            });
        },
        filteredCollections: function(){
            var self = this;
            return self.collections.filter( function(collection) {
                return collection.label.toLowerCase().includes(self.filterQuery.toLowerCase());
            });
        },
        displayFilteredResults: function(){
            return this.filterQuery.length > 2;
        },
        noFilterResults: function(){
            return this.filteredCollections.length == 0;
        },
        filterSectionLabel: function(){

            var prefix = 'Results for "';
            var middle = '';
            var suffix = '":';

            if (this.filterQuery.length > 10)
                middle = this.filterQuery.substring(0,9) + '...';
            else
                middle = this.filterQuery;

            return prefix + middle + suffix;
        },
        navHeader: function(){
            return store.getters.navHeader;
        }
    }

});

Vue.component('side-nav-menu-section', {

    template: '#sideNavMenuSectionTemplate',

    props: ['headerLabel', 'collections'],

    methods: {
        collectionSelected: function(collectionLabel) {
            console.log(collectionLabel);
        }
    }

});

new Vue({
    el: '#app',

    computed: {
        view: function() {
            return store.getters.view;
        }
    }
});