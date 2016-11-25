const store = new Vuex.Store({

    state: {
        currentPage: '/app/collections',
        collections: [
            { 
                label: 'Animals',
                documents: [
                    'Dog',
                    'Cat',
                    'Mouse',
                    'Squirrel',
                    'Elephant'
                ]
            },
            { 
                label: 'Plants',
                documents: [
                    'Tree',
                    'Flower',
                    'Bush',
                    'Vine',
                    'Shrubbery'
                ]
            },
            { 
                label: 'Dinosaurs',
                documents: [
                    'T-Rex',
                    'Triceratops',
                    'Pteradactyl',
                    'Stegasaurus',
                    'Velociraptor'
                ]
            },
            { 
                label: 'Aliens',
                documents: [
                    'Greg',
                    'Bob',
                    'Susan',
                    'Johnny',
                    'Angela'
                ]
            }
        ],
        collectionQuery: '',
        currentCollection: null,
        mobileCollectionView: 'DocumentView',
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

            if(state.currentCollection)
            {
                return state.currentCollection.label;
            }
            else
            {
                switch(state.currentPage)
                {
                    case '/app/collections':
                        return 'Collections';
                }
                return '';
            }
        },
        showDocumentsOnMobile: function(state){
            return state.mobileCollectionView == 'DocumentView';
        }
    },

    mutations: {

        signInUser: function(state, user) {
            state.user = user;
        },
        signOutUser: function(state) {
            state.user = null;
        },
        setPage: function(state, newPage) {
            state.currentPage = newPage;
        },
        setCollectionQuery: function(state, newCollectionQuery) {
            state.collectionQuery = newCollectionQuery;
        },
        setCollection: function(state, newCollection) {
            state.currentCollection = newCollection;
        },
        removeCollection: function(state) {
            state.currentCollection = null;
        },
        setMobileCollectionView: function(state, newMobileCollectionView) {
            state.mobileCollectionView = newMobileCollectionView;
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
                'is-success',
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
                    store.commit('signInUser', {
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
    template: '#collectionsPageTemplate',

    computed: {
        currentCollection: function(){
            return store.state.currentCollection;
        }
    }
});

Vue.component('navbar', {
    template: '#navbarTemplate',

    computed: {

        navHeader: function(){
            return store.getters.navHeader;
        },
        hasCurrentCollection: function(){
            return store.state.currentCollection != null;
        }
    },

    methods: {
        signOut: function(){
            store.commit('setUser', null);
            store.commit('setPage', '/sign-in');
        },
        removeCollection: function(){
            store.commit('removeCollection');
        }
    }
});

Vue.component('side-nav', {
    template: '#sideNavTemplate',

    data: function(){
        return {
            allCollectionsLabel: 'All Collections'
        };
    },

    computed: {
        alphabetizedCollections: function(){
            return this.collections.sort( function(x,y) {
                return x.label > y.label;
            });
        },
        collections: function(){
            return store.state.collections;
        },
        filteredCollections: function(){
            var self = this;
            return self.collections.filter( function(collection) {
                return collection.label.toLowerCase().includes(store.state.collectionQuery.toLowerCase());
            });
        },
        displayFilteredCollections: function(){
            return store.state.collectionQuery.length > 0;
        },
        filterSectionLabel: function(){

            var prefix = 'Results for "';
            var middle = '';
            var suffix = '":';

            if (store.state.collectionQuery.length > 10)
                middle = store.state.collectionQuery.substring(0,9) + '...';
            else
                middle = store.state.collectionQuery;

            return prefix + middle + suffix;
        },
        currentCollection: function(){
            return store.state.currentCollection;
        },
        collectionIsSelected: function(){
            return store.state.currentCollection != null;
        },
        shouldRenderDocumentView: function(){
            return store.getters.showDocumentsOnMobile;
        }
    }

});

Vue.component('side-nav-menu-section', {

    template: '#sideNavMenuSectionTemplate',

    props: ['headerLabel', 'collections'],

    data: function(){
        return {
            expandedCollection: null
        };
    },

    methods: {
        collectionSelected: function(collection) {
            store.commit('setCollection', collection);
        },
        collectionExpanded: function(collection) {
            if(collection == this.expandedCollection)
            {
                this.expandedCollection = null;
            }
            else
            {
                this.expandedCollection = collection;
            }
        },
        editCollection: function(collection) {
            store.commit('setMobileCollectionView', 'CollectionView');
            store.commit('setCollection', collection);
        },
        editDocuments: function(collection) {
            store.commit('setMobileCollectionView', 'DocumentView');
            store.commit('setCollection', collection);
        }
    }

});

Vue.component('document-view', {

    computed: {
        currentCollection: function(){
            return store.state.currentCollection;
        }
    },

    template: '#documentViewTemplate'

});

Vue.component('mobile-search-header', {

    template: '#mobileSearchHeaderTemplate',

    computed: {

        navHeader: function(){
            return store.getters.navHeader;
        },
        collectionIsSelected: function(){
            return store.state.currentCollection != null;
        },
        shouldRenderDocumentView: function(){
            return store.getters.showDocumentsOnMobile;
        }

    },

    methods: {
        setCollectionQuery: function(e){
            var query = e.target.value;
            store.commit('setCollectionQuery', query);
        },
        setDocumentQuery: function(e){
            var query = e.target.value;
            //store.commit('setDocumentQuery', text);
        },
    }

});

Vue.component('desktop-search-header', {

    template: '#desktopSearchHeaderTemplate',

    computed: {

        navHeader: function(){
            return store.getters.navHeader;
        },
        collectionIsSelected: function(){
            return store.state.currentCollection != null;
        },
        shouldRenderDocumentView: function(){
            return store.getters.showDocumentsOnMobile;
        },
        currentCollection: function(){
            return store.state.currentCollection;
        }

    },

    methods: {
        setCollectionQuery: function(e){
            var query = e.target.value;
            store.commit('setCollectionQuery', query);
        },

        clearCurrentCollection: function(){
            store.commit('removeCollection');
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