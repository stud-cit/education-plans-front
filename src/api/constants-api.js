const version = '/v1';

export const API = {
  "USER": version + '/getUser',
  "LOGIN": version + '/login',
  // "REGISTER": version + '/register',
  "LOGOUT": version + '/logout',
  "LIST_PLANS": version + '/plans',
  "COPY_PLAN": version + '/plans/copy/',
  "DESTROY_PLAN": version + '/plans/',
  "SETTINGS": version + '/settings/',
  "STUDY_TERMS": version + '/study-terms/',
  "FORM_STUDIES": version + '/form-studies/',
  "FORM_ORGANIZATIONS": version + '/form-organizations'
};

export const ALLOWED_REQUEST_PARAMETERS = {
  "GET_PLANS": {
    itemsPerPage: 'items_per_page',
    page: 'page',
    searchTitle: 'title',
    sortBy: 'sort_by',
    sortDesc: 'sort_desc',
    faculty: 'faculty',
    department: 'department'
  }
};
