import messageBoxTemplate from './messageBox-template.vue';

const messageBox = {
  install(Vue) {
    let MessageBoxConstructor = Vue.extend(messageBoxTemplate);
    let messageBoxInstance = null;

    window.messageBox = function() {};

    window.messageBox.show = function(title, message, messageBoxButton, icon) {
      if (!messageBoxInstance) {
        messageBoxInstance = new MessageBoxConstructor({
          el: document.createElement('div'),
          data() {
            return {
              title: title,
              message: message
            };
          }
        });

        document.body.appendChild(messageBoxInstance.$el);
      }

      if (icon === null || icon === undefined || icon === '') {
        icon = 'warning';
      }
      return new Promise(resolve => {
        messageBoxInstance.isShowModal = true;
        messageBoxInstance.title = title;
        messageBoxInstance.message = message;
        messageBoxInstance.buttons = messageBoxButton;
        messageBoxInstance.icon = icon;
        messageBoxInstance.promiseResolver = resolve;
      });
    };

    window.messageBox.close = function() {
      if (messageBoxInstance) {
        messageBoxInstance.isShowModal = false;
      }
    };
  }
};

export default messageBox;
