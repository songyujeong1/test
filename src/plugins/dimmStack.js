import { Loading } from 'element-ui';

export function push() {
  if (window.__CLIENT_STATE__.dimmInstance === null) {
    window.__CLIENT_STATE__.dimmInstance = Loading.service({
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }

  window.__CLIENT_STATE__.dimmStack[window.__CLIENT_STATE__.stackTop++] = null;
}

export function pop() {
  window.__CLIENT_STATE__.dimmStack.splice(--window.__CLIENT_STATE__.stackTop, 1);

  if ( window.__CLIENT_STATE__.dimmStack.length === 0 && window.__CLIENT_STATE__.dimmInstance) {
    window.__CLIENT_STATE__.dimmInstance.close();
    window.__CLIENT_STATE__.dimmInstance = null;
  }
}
