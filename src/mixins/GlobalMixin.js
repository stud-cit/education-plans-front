export default {
    components: {},
    data() {
        return {}
    },
    methods: {
        GlobalHandlingRequestParameters(permitted, params) {
            let obj = {};
            for(let param in params) {
                if(Object.prototype.hasOwnProperty.call(permitted, param)) {
                    if (params[param] !== '' && params[param] !== null && params[param].lengths !== 0) {
                        obj[permitted[param]] = params[param];
                    }
                }
            }
            return obj;
        },
        GlobalSumPropertyInArray(items, prop){
          return items.reduce( function(a, b){
            return a + b[prop];
          }, 0);
        }
    }
}
