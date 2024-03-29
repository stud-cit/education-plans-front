const planDefault = {
  title: null,
  faculty_id: null,
  department_id: null,
  education_level_id: null,
  form_study_id: null,
  study_term: null,
  year: new Date().getFullYear(),
  speciality_id: null,
  specialization_id: null,
  education_program_id: null,
  qualification_id: null,
  field_knowledge_id: null,
  form_organization_id: null,
  credits: null,
  published: false,
  verification: [],
  submitLoader: false,
  signatures: []
}

export default {
  plan: planDefault,
  errorsPlan: [],
  indexComponent: 1,
  plans: {
    items: [],
    meta: {}
  },
  options: {},
  loading: true,
  default: planDefault
}
