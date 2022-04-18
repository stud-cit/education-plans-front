const apiData = {
  faculties: [
    {
      id: 1,
      title: 'ЕЛІТ'
    },
    {
      id: 2,
      title: 'ФЕМ'
    },
  ],
  departments: [
    {
      id: 1,
      id_faculty: 1,
      title: 'Прикладна фізика'
    },
    {
      id: 2,
      id_faculty: 2,
      title: 'Прикладна математика'
    },
  ],
  educationsLevel: [
    {
      id: 1,
      title: 'Бакалавр'
    },
    {
      id: 2,
      title: 'Магістр'
    },
    {
      id: 3,
      title: 'Доктор філософії'
    },
  ],
  formsStudy: [
    {
      id: 1,
      title: 'Денна'
    },
    {
      id: 2,
      title: 'Заочна'
    },
  ],
  termsStudy: [
    {
      id: 1,
      title: '3 роки 10 місяців',
      numberSemesters: 10
    },
    {
      id: 2,
      title: '1 роки 10 місяців',
      numberSemesters: 20
    },
  ],
  specialities: [
    {
      id: 1,
      title: 'Електроніка',
    },
    {
      id: 2,
      title: 'Право',
    },
  ],
  educationalPrograms: [
    {
      id: 1,
      title: 'Психологія',
    },
    {
      id: 2,
      title: 'Менеджмент',
    },
  ],
  qualifications: [
    {
      id: 1,
      title: 'Бакалавр з психології',
    },
    {
      id: 2,
      title: 'Бакалавр з економіки',
    },
  ],
  branchesKnowledge: [
    {
      id: 1,
      title: 'Соціальні та поведінкові науки',
    },
    {
      id: 2,
      title: 'Управління та адміністрування',
    },
  ],
  formsOrganizationStudy: [
    {
      id: 1,
      title: 'Модульно-циклова',
    },
    {
      id: 2,
      title: 'Семестрова',
    },
  ],
}
function getApiSimulator(key = null) {
  if (key === null) {
    return apiData
  } else {
    return apiData[key];
  }
}

export {getApiSimulator};
