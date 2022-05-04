const version = '/v1';

export const API = {
  "USER": version + '/getUser',
  "LOGIN": version + '/login',
  // "REGISTER": version + '/register',
  "LOGOUT": version + '/logout',
  "COPY_PLAN": version + '/plans/copy/',
  "SETTINGS": version + '/settings',
  "STUDY_TERMS": version + '/study-terms',
  "FORM_STUDIES": version + '/form-studies',
  "FORM_ORGANIZATIONS": version + '/form-organizations',
  "PLAN_CREATE": version + '/plans/create',
  "PLANS": version + '/plans',
  "DEPARTMENTS": version + '/departments',
  "USERS": version + '/users',
  "FACULTIES": version + '/faculties',
  "ROLES": version + '/roles',
  "WORKERS": version + '/workers',
  "FACULTY_BY_WORKER": version + '/faculty-by-worker',
  "SELECTIVE_DISCIPLINES": version + '/selective-discipline',
  "CYCLES": version + '/cycles', // for tests
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
