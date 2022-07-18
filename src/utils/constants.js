export const ROLES = {
  ID: {
      'admin': 1,
      'training_department': 2,
      'practice_department': 3,
      'educational-department-deputy': 4,
      'educational-department-chief': 5,
      'faculty_institute': 6,
      'department': 7,
      'root': 8,
  },
}
export const FORM_ORGANIZATIONS = {
  modular_cyclic: 1,
  semester: 3
}

export const FORM_ORGANIZATIONS_TABLE = {
  [FORM_ORGANIZATIONS.modular_cyclic]: 2, //modular_cyclic
  [FORM_ORGANIZATIONS.semester]: 1 //semester
}

export const VERIFICATION_STATUS = {
  success: 'success',
  warning: 'warning',
  error: 'error',
}
