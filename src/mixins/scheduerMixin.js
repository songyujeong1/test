export const scheduerMixin = {
  methods: {
    getTaskColor(taskCode, isHoliday) {
      if ( isHoliday === true ) {
        return '#ff0000';
      }
      switch (taskCode) {
        case '96000001':
          return '#67c23A';
        case '96000002':
          return '#E6A23C';
        case '96000003':
          return '#F56C6C';
        case '96000004':
          return '#909399';
        default:
          return '#000';
      }
    },
    getTaskClass(tasks, isHoliday) {
      if ( isHoliday === true ) {
        return {
          'border-right': 'solid 7px #ff0000',
          'border-top': 'solid 7px #ff0000'
        };
      }

      const calcType = tasks[0].calcType;
      switch (calcType) {
        case '96000001':
          return {
            'border-right': 'solid 7px #67c23A',
            'border-top': 'solid 7px #67c23A'
          };
        case '96000002':
          return {
            'border-right': 'solid 7px #E6A23C',
            'border-top': 'solid 7px #E6A23C'
          };
        case '96000003':
          return {
            'border-right': 'solid 7px #F56C6C',
            'border-top': 'solid 7px #F56C6C'
          };
        case '96000004':
          return {
            'border-right': 'solid 7px #909399',
            'border-top': 'solid 7px #909399'
          };
        default:
          return {
            'border-right': 'solid 7px #66a3ff',
            'border-top': 'solid 7px #66a3ff'
          };
      }
    }
  }
};
